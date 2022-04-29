const { Types } = require("mongoose");
const SupplyRequestModel = require("../../../../models/SupplyRequest");
const UserModel = require("../../../../models/User");
const { supplyRequestStatus, userTypes } = require("../../../../models/constants");
const { validateSchema } = require("../../../../middlewares/schema");
const schemas = require("./schemas");
const CustomError = require("../../../../errors/CustomError");

const listSupplyRequests = async ({ userId = null, vendorId = null, paginationToken = null, _id, requestStatus }) => {
  const supplyRequests = await SupplyRequestModel.aggregate([
    {
      $match: {
        ...(_id && { _id: new Types.ObjectId(_id) }),
        ...(paginationToken && {
          _id: {
            $gt: paginationToken,
          },
        }),
        ...(userId && { userId }),
        ...(vendorId && { vendorId }),
        ...(requestStatus && { requestStatus }),
      },
    },
    { $limit: 15 },
    {
      $lookup: {
        from: "users",
        let: { userId: "$userId" },
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
              logo: 1,
            },
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "users",
        let: { vendroId: "$vendorId" },
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
              logo: 1,
            },
          },
        ],
        as: "vendor",
      },
    },
    {
      $unwind: "$vendor",
    },
  ]);

  return supplyRequests;
};

const getSupplyRequestInfo = async (supplyRequestId) => {
  const supplyRequest = (await listSupplyRequests({ _id: supplyRequestId }))[0];

  if (!supplyRequest)
    throw new CustomError("SUPPLY_REQEUST_NOT_FOUND", "طلب عرض السعر الذي تريد الوصول اليه غير موجود");

  return supplyRequest;
};

// User only
const createSupplyRequest = validateSchema(schemas.createSupplyRequestSchema)(async (supplyRequest) => {
  // Check if vendorId exist
  const isVendorValid = await UserModel.findOne({ _id: supplyRequest.vendorId, userType: userTypes.VENDOR });
  if (!isVendorValid) throw new CustomError("VENDOR_NOT_EXIST", "البائع الذي تحاول الشراء منه غير موجود");

  // Generate the custom id
  const totalSupplyRequests = await SupplyRequestModel.countDocuments();

  const generatedId = `MD_${totalSupplyRequests + 10000}`;

  console.log({ generatedId });
  // Create the supply request first
  const result = await SupplyRequestModel.create({
    ...supplyRequest,
    transportationHandler: supplyRequest.isTransportationNeeded ? userTypes.VENDOR : userTypes.USER,
    generatedId,
  });

  const createdSupplyRequest = await getSupplyRequestInfo(result._id);
  // @TODO: send notification to the vendor

  return createdSupplyRequest;
});

// User only
const resendSupplyRequest = validateSchema(schemas.resendSupplyRequestSchema)(async (supplyRequest) => {
  // Validate request status & existence
  const supplyRequestSearch = await getSupplyRequestInfo(supplyRequest.supplyRequestId);

  // Check if request status is fucked
  if (supplyRequestSearch.requestStatus != supplyRequestStatus.AWAITING_APPROVAL)
    throw new CustomError("STATUS_NOT_CORRECT", "لا يمكنك اعادة ارسال العرض، حالة العرض غير صحيحة");

  await SupplyRequestModel.updateOne(
    { _id: supplyRequest.supplyRequestId },
    {
      $set: {
        requestItems: supplyRequest.requestItems,
        additionalItems: supplyRequest.additionalItems || [],
        requestStatus: supplyRequestStatus.AWAITING_QUOTATION,
      },
    },
    { new: true }
  );

  const updatedSupplyRequest = await getSupplyRequestInfo(supplyRequest.supplyRequestId);
  // @TODO: send notification to the vendor

  return updatedSupplyRequest;
});

// Vendor only
const quoteSupplyRequest = validateSchema(schemas.quoteSupplyRequestSchema)(
  async ({ requestItems = [], additionalItems = [], ...quotation }) => {
    // Validate request status & existence
    const supplyRequestSearch = await getSupplyRequestInfo(quotation.supplyRequestId);

    // Check if request status is fucked
    if (supplyRequestSearch.requestStatus != supplyRequestStatus.AWAITING_QUOTATION)
      throw new CustomError("STATUS_NOT_CORRECT", "لا يمكنك تحديث العرض، حالة العرض غير صحيحة");

    // Check if vendor is responsible for transporation
    if (supplyRequestSearch.transportationHandler == userTypes.VENDOR && !quotation.transportationPrice)
      throw new CustomError("TRANSPORTATION_PRICE_NOT_SENT", "يجب وضع سعر التوصيل مع العرض");

    /*------Check if all items exist on supply request------*/
    if (supplyRequestSearch.requestItems.length !== requestItems.length)
      throw new CustomError("REQUEST_ITEMS_NOT_CORRECT", "يرجي التأكد من عدد المنتجات التي قمت بوضع سعر عليها");

    if (supplyRequestSearch.additionalItems.length !== additionalItems.length)
      throw new CustomError(
        "ADDITIONAL_ITEMS_NOT_CORRECT",
        "يرجي التأكد من عدد المنتجات الاضافية التي قمت بوضع سعر عليها"
      );

    for (const item of supplyRequestSearch.requestItems) {
      if (!requestItems.map((r) => r.itemId).includes(item._id.toString()))
        throw new CustomError("REQUEST_ITEM_MISSING", `لم تقم بارسال عرض سعر للمنتج: ${item.name}`);
    }

    for (const item of supplyRequestSearch.additionalItems) {
      if (!additionalItems.map((r) => r.itemId).includes(item._id.toString()))
        throw new CustomError("ADDITIONAL_ITEM_MISSING", `لم تقم بارسال عرض سعر للمنتج الاضافي: ${item.name}`);
    }

    /*----------------------------------------------------*/

    // Update the supply request with bulk write
    let bulkOptions = [];
    bulkOptions = [
      ...bulkOptions,
      ...requestItems.map((item) => ({
        updateOne: {
          filter: { _id: quotation.supplyRequestId, "requestItems._id": item.itemId },
          update: { $set: { "requestItems.$.totalPrice": item.totalPrice } },
        },
      })),
    ];

    bulkOptions = [
      ...bulkOptions,
      ...additionalItems.map((item) => ({
        updateOne: {
          filter: { _id: quotation.supplyRequestId, "additionalItems._id": item.itemId },
          update: { $set: { "additionalItems.$.price": item.price } },
        },
      })),
      {
        updateOne: {
          filter: { _id: quotation.supplyRequestId },
          update: {
            $set: {
              requestStatus: supplyRequestStatus.AWAITING_APPROVAL,
              estimationInSeconds: quotation.estimationInSeconds,
              ...(quotation.transportationPrice &&
                supplyRequestSearch.transportationHandler == userTypes.VENDOR && {
                  transportationPrice: quotation.transportationPrice,
                }),
            },
          },
        },
      },
    ];

    await SupplyRequestModel.bulkWrite(bulkOptions);

    // Get the supply request after update
    const updatedSupplyRequest = await getSupplyRequestInfo(quotation.supplyRequestId);

    // @TODO: send notification to the user

    return updatedSupplyRequest;
  }
);

// User Only
const acceptSupplyRequest = async (supplyRequestId) => {
  const supplyRequestSearch = await getSupplyRequestInfo(supplyRequestId);

  // Check if request status is fucked
  if (supplyRequestSearch.requestStatus != supplyRequestStatus.AWAITING_APPROVAL)
    throw new CustomError("STATUS_NOT_CORRECT", "لا يمكنك الموافقة علي العرض، حالة العرض غير صحيحة");

  // Update the supply request
  await SupplyRequestModel.updateOne(
    { _id: supplyRequestId },
    { $set: { requestStatus: supplyRequestStatus.PREPARING } }
  );

  const updatedSupplyRequest = await getSupplyRequestInfo(supplyRequestId);

  // @TODO: send notification to the vendor
  return updatedSupplyRequest;
};

module.exports = {
  createSupplyRequest,
  resendSupplyRequest,
  quoteSupplyRequest,
  listSupplyRequests,
  getSupplyRequestInfo,
  acceptSupplyRequest,
};
