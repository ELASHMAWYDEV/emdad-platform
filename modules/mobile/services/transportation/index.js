const { validateSchema } = require("../../../../middlewares/schema");
const TransportationRequestModel = require("../../../../models/TransportationRequest");
const TransportationOfferModel = require("../../../../models/TransportationOffer");
const SupplyRequestModel = require("../../../../models/SupplyRequest");
const schemas = require("./schemas");
const supplyService = require("../supply");
const { userTypes, paymentStatus } = require("../../../../models/constants");
const CustomError = require("../../../../errors/CustomError");
const { Types } = require("mongoose");
const { listTransporters } = require("../user");
const { WEBSITE_URL } = require("../../../../globals");

const listTransportationRequests = async ({
  _id = null,
  paginationToken = null,
  limit = 15,
  requesterId = null,
  city = "",
  transportationStatus = "",
  transporterId = null,
}) => {
  const transportationRequests = await TransportationRequestModel.aggregate([
    {
      $match: {
        ...(_id && {
          _id: new Types.ObjectId(_id),
        }),
        ...(paginationToken && {
          _id: {
            $gt: paginationToken,
          },
        }),
        ...(requesterId && {
          requesterId: new Types.ObjectId(requesterId),
        }),
        ...(city && {
          city,
        }),
        ...(transportationStatus && { transportationStatus }),
        ...(transporterId && {
          "transportationOffer.transporterId": new Types.ObjectId(transporterId),
        }),
      },
    },
    {
      $limit: Number(limit),
    },
    {
      $lookup: {
        from: "users",
        let: { requesterId: "$requesterId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$requesterId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
              vendorType: 1,
              country: 1,
              city: 1,
              location: 1,
              oraganizationName: 1,
              logo: { $concat: [WEBSITE_URL, "/images/users/", "$logo"] },
            },
          },
        ],
        as: "requester",
      },
    },
    {
      $unwind: "$requester",
    },
    {
      $lookup: {
        from: "supplyRequests",
        localField: "supplyRequestId",
        foreignField: "_id",
        as: "supplyRequest",
      },
    },
    {
      $unwind: "$supplyRequest",
    },
    {
      $lookup: {
        from: "users",
        let: { userId: "$supplyRequest.userId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
              vendorType: 1,
              country: 1,
              city: 1,
              location: 1,
              oraganizationName: 1,
              logo: { $concat: [WEBSITE_URL, "/images/users/", "$logo"] },
            },
          },
        ],
        as: "supplyRequest.user",
      },
    },
    {
      $unwind: "$supplyRequest.user",
    },
    {
      $lookup: {
        from: "users",
        let: { vendroId: "$supplyRequest.vendorId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$vendroId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
              country: 1,
              city: 1,
              location: 1,
              oraganizationName: 1,
              logo: { $concat: [WEBSITE_URL, "/images/users/", "$logo"] },
            },
          },
        ],
        as: "supplyRequest.vendor",
      },
    },
    {
      $unwind: "$supplyRequest.vendor",
    },
  ]);

  return transportationRequests;
};

const getTransportationRequestInfo = async (transportationRequestId) => {
  const transportationRequest = (
    await listTransportationRequests({
      _id: transportationRequestId,
    })
  )[0];

  if (!transportationRequest)
    throw new CustomError("TRANSPORTATION_REQEUST_NOT_FOUND", "طلب النقل الذي تريد الوصول اليه غير موجود");

  return transportationRequest;
};

const createTransportationRequest = validateSchema(schemas.createTransportationRequestSchema)(
  async (transportationRequest) => {
    // Get the supply request
    const supplyRequest = await supplyService.getSupplyRequestInfo(transportationRequest.supplyRequestId);

    // Check if requester type is what the supply request says
    if (transportationRequest.requesterType != supplyRequest.transportationHandler) {
      throw new CustomError("REQUESTER_NOT_RECOGNIZED", "ليس لك حق عمل طلب نقل لعرض السعر هذا");
    }

    // User must pay for the vendor first (if he want to send transportation request)
    if (transportationRequest.requesterType == userTypes.USER && supplyRequest.paymentStatus != paymentStatus.PAID) {
      throw new CustomError("SUPPLY_REQUET_UNPAID", "يجب دفع عرض السعر أولا");
    }

    // Validate already made transportation request
    if (supplyRequest.transportationRequestId) {
      throw new CustomError(
        "TRANSPORTATION_REQUEST_ALREADY_CREATED",
        "هناك طلب شركة نقل بالفعل لعرض السعر الذي تحاول الطلب له"
      );
    }

    // Create the transportation request
    const createdRequest = await TransportationRequestModel.create(transportationRequest);

    // Add the transportationRequestId to the supply request
    await SupplyRequestModel.updateOne(
      { _id: transportationRequest.supplyRequestId },
      { $set: { transportationRequestId: createdRequest._id } }
    );

    // Send the request to all transporters in the city
    sendTransportationRequest(createdRequest._id);

    // Get the transportation request full details
    const createdTransportationRequest = await getTransportationRequestInfo(createdRequest._id);

    return createdTransportationRequest;
  }
);

const sendTransportationRequest = async (transportationRequestId) => {
  // Get transportation full details
  const transportationRequest = await getTransportationRequestInfo(transportationRequestId);

  // Get all transporters in the same city
  const transporters = await listTransporters({
    limit: 0,
    city: transportationRequest.city,
  });

  // Send notification to all of them
  // @TODO: send notification to all transporters with the transportation details
};

const createTransportationOffer = validateSchema(schemas.createTransportationOfferSchema)(
  async (transportationOffer) => {
    // Check if transportation request exist or not
    const transportationRequest = await getTransportationRequestInfo(transportationOffer.transportationRequestId);

    // Check if this transporter already created an offer
    if (
      await TransportationOfferModel.findOne({
        transporterId: transportationOffer.transporterId,
        transportationRequestId: transportationOffer.transportationRequestId,
      })
    ) {
      throw new CustomError("TRANSPORTER_ALREADY_SENT_OFFER", "لقد قمت بارسال عرض توصيل لهذا الطلب من قبل");
    }
    // Create the offer
    const createdOffer = await TransportationOfferModel.create(transportationOffer);

    // @TODO: send notification to the requester to inform him of the new offer

    const createdTransportationOffer = await getTransportationOfferInfo(createdOffer._id);

    return createdTransportationOffer;
  }
);

const listTransportationOffers = async ({
  _id = null,
  paginationToken = null,
  limit = 15,
  transporterId = null,
  transportationRequestId = null,
}) => {
  const transportationOffers = await TransportationOfferModel.aggregate([
    {
      $match: {
        ...(_id && {
          _id: new Types.ObjectId(_id),
        }),
        ...(paginationToken && {
          _id: {
            $gt: paginationToken,
          },
        }),
        ...(transporterId && {
          transporterId: new Types.ObjectId(transporterId),
        }),
        ...(transportationRequestId && {
          transportationRequestId: new Types.ObjectId(transportationRequestId),
        }),
      },
    },
    {
      $limit: Number(limit),
    },
    {
      $lookup: {
        from: "users",
        let: { transporterId: "$transporterId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$transporterId"] } } },
          {
            $project: {
              _id: 1,
              name: 1,
              vendorType: 1,
              country: 1,
              city: 1,
              location: 1,
              oraganizationName: 1,
              logo: { $concat: [WEBSITE_URL, "/images/users/", "$logo"] },
            },
          },
        ],
        as: "transporter",
      },
    },
    {
      $unwind: "$transporter",
    },
    {
      $lookup: {
        from: "transportationRequests",
        localField: "transportationRequestId",
        foreignField: "_id",
        as: "transportationRequest",
      },
    },
    {
      $unwind: "$transportationRequest",
    },
  ]);

  return transportationOffers;
};

const getTransportationOfferInfo = async (transportationOfferId) => {
  const transportationOffer = (
    await listTransportationOffers({
      _id: transportationOfferId,
    })
  )[0];

  if (!transportationOffer)
    throw new CustomError("TRANSPORTATION_OFFER_NOT_FOUND", "عرض النقل الذي تريد الوصول اليه غير موجود");

  return transportationOffer;
};

const acceptTransportationOffer = async (transportationOfferId) => {
  const transportationOffer = await getTransportationOfferInfo(transportationOfferId);

  // Get the transportation request of this offer
  const transportationRequest = await getTransportationRequestInfo(transportationOffer.transportationRequestId);

  // Check if no other offers were accepted
  if (transportationRequest.transportationOffer) {
    throw new CustomError("ANOTHER_TRANSPORTATION_OFFER_ACCEPTED", "لقد قمت بالموافقة علي عرض توصيل بالفعل");
  }

  // Update the transportation request with this offer
  await TransportationRequestModel.updateOne(
    { _id: transportationOffer.transportationRequestId },
    { transportationOffer: { ...transportationOffer, offerId: transportationOffer._id } }
  );
};

module.exports = {
  listTransportationRequests,
  getTransportationRequestInfo,
  createTransportationRequest,
  sendTransportationRequest,
  createTransportationOffer,
  listTransportationOffers,
  getTransportationOfferInfo,
  acceptTransportationOffer,
};
