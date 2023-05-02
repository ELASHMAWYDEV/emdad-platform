const { validateSchema } = require("../../../../middlewares/schema");
const TransportationRequestModel = require("../../../../models/TransportationRequest");
const TransportationOfferModel = require("../../../../models/TransportationOffer");
const UserModel = require("../../../../models/User");
const SupplyRequestModel = require("../../../../models/SupplyRequest");
const schemas = require("./schemas");
const supplyService = require("../supply");
const { userTypes, paymentStatus, transportationStatus, ObjectId } = require("../../../../models/constants");
const CustomError = require("../../../../errors/CustomError");
const { Types } = require("mongoose");
const { listTransporters } = require("../user");
const { WEBSITE_URL } = require("../../../../globals");
const { sendNotification } = require("../../../../helpers");

const listTransportationRequests = async ({
  _id = null,
  paginationToken = null,
  limit = 15,
  requesterId = null,
  cities = [],
  transportationStatus = "",
  transporterId = null,
}) => {
  const transportationRequests = await TransportationRequestModel.aggregate([
    {
      $match: {
        ...(_id && {
          _id: ObjectId(_id),
        }),
        ...(paginationToken && {
          _id: {
            $gt: paginationToken,
          },
        }),
        ...(requesterId && {
          requesterId: new Types.ObjectId(requesterId),
        }),
        ...(cities.length != 0 && {
          cities: { $in: cities },
        }),
        ...(transportationStatus && { transportationStatus }),
        ...(transporterId && {
          "transportationOffer.transporterId": ObjectId(transporterId),
        }),
      },
    },
    {
      $sort: {
        createdAt: -1,
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
              locationObject: {
                lat: { $arrayElemAt: ["$location.coordinates", 1] },
                lng: { $arrayElemAt: ["$location.coordinates", 0] },
              },
              oraganizationName: 1,
              logo: 1,
              logoUrl: {
                $concat: [`${WEBSITE_URL}/images/users/`, "$logo"],
              },
              firebaseToken: 1,
              deviveType: 1,
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
              locationObject: {
                lat: { $arrayElemAt: ["$location.coordinates", 1] },
                lng: { $arrayElemAt: ["$location.coordinates", 0] },
              },
              oraganizationName: 1,
              logo: 1,
              logoUrl: {
                $concat: [`${WEBSITE_URL}/images/users/`, "$logo"],
              },
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
              locationObject: {
                lat: { $arrayElemAt: ["$location.coordinates", 1] },
                lng: { $arrayElemAt: ["$location.coordinates", 0] },
              },
              oraganizationName: 1,
              logo: 1,
              logoUrl: {
                $concat: [`${WEBSITE_URL}/images/users/`, "$logo"],
              },
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

    //@TODO: remove commenting
    // User must pay for the vendor first (if he want to send transportation request)
    // if (transportationRequest.requesterType == userTypes.USER && supplyRequest.paymentStatus != paymentStatus.PAID) {
    //   throw new CustomError("SUPPLY_REQUEST_UNPAID", "يجب دفع عرض السعر أولا");
    // }

    // Validate already made transportation request
    if (supplyRequest.transportationRequestId) {
      throw new CustomError(
        "TRANSPORTATION_REQUEST_ALREADY_CREATED",
        "هناك طلب شركة نقل بالفعل لعرض السعر الذي تحاول الطلب له"
      );
    }

    // Generate the custom id
    const totalTransportationRequests = await SupplyRequestModel.countDocuments();

    const generatedId = `TD_${totalTransportationRequests + 10000}`;

    console.log({ generatedId });

    // Create the transportation request
    const createdRequest = await TransportationRequestModel.create({ ...transportationRequest, generatedId });

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

  // Get all transporters in the request cities
  const transporters = await listTransporters({
    city: { $in: transportationRequest.cities },
  });

  // send notification to all transporters with the transportation details
  transporters.forEach((transporter) => {
    sendNotification({
      userId: transporter._id,
      title: "طلب نقل جديد",
      body: `لديك طلب نقل جديد من ${transportationRequest.requester.name}`,
      type: 13,
      data: transportationRequest,
    });
  });
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

    // send notification to the requester to inform him of the new offer
    sendNotification({
      userId: createdOffer.transporter._id,
      title: "عرض توصيل جديد",
      body: "لقد تلقيت عرض توصيل جديد من شركة نقل",
      type: 3,
      data: createdOffer,
    }).catch(console.log);

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
          _id: ObjectId(_id),
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
      $sort: {
        createdAt: -1,
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
              logo: 1,
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

  return transportationOffers.map((offer) => ({ ...offer, transporter: new UserModel(offer.transporter).toJSON() }));
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

const changeTransporationRequestStatus = async ({ transportationRequestId, status }) => {
  // Check if the status is valid
  if (!Object.values(transportationStatus).includes(status)) {
    throw new CustomError("INVALID_STATUS", "الحالة المرسلة غير صالحة");
  }

  // Get the transportation request
  let transportationRequest = await getTransportationRequestInfo(transportationRequestId);

  // Check if the status is the same as the current status
  if (transportationRequest?.transportationStatus === status) {
    throw new CustomError("SAME_STATUS", "الحالة المرسلة هي نفس الحالة الحالية");
  }

  // Check if the status is valid with a transportation offer
  if (status !== transportationStatus.AWAITING_OFFERS && !transportationRequest.transportationOffer) {
    throw new CustomError("NO_TRANSPORTATION_OFFER", "لا يوجد عرض توصيل مقبول");
  }

  // Check if status is valid with gradual status
  if (
    Object.values(transportationStatus).indexOf(status) <=
    Object.values(transportationStatus).indexOf(transportationRequest.transportationStatus)
  ) {
    throw new CustomError("INVALID_STATUS_ORDER", "ترتيب الحالة المرسلة غير صحيح");
  }

  // Update the transportation request status
  await TransportationRequestModel.updateOne({ _id: transportationRequestId }, { transportationStatus: status });

  // Send notification to the transporter
  sendNotification({
    userId: transportationRequest.transportationOffer.transporterId,
    title: "تغيير حالة الطلب",
    body: "تم تغيير حالة الطلب الخاص بك",
    type: 15,
    data: transportationRequest,
  }).catch(console.log);

  // Send notification to the requester
  sendNotification({
    userId: transportationRequest.requesterId,
    title: "تغيير حالة التوصيل للطلب الخاص بك",
    body: "تم تغيير حالة التوصيل الخاص بك",
    type: 15,
    data: transportationRequest,
  }).catch(console.log);

  // Get the transportation request again
  transportationRequest = await getTransportationRequestInfo(transportationRequestId);

  return transportationRequest;
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
  changeTransporationRequestStatus,
};
