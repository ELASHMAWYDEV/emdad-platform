const SupplyRequestModel = require("../../../../models/SupplyRequest");
const UserModel = require("../../../../models/User");
const { supplyRequestStatus, userTypes } = require("../../../../models/constants");
const { validateSchema } = require("../../../../middlewares/schema");
const schemas = require("./schemas");

// User only
const createSupplyRequest = validateSchema(schemas.createSupplyRequestSchema)(async (supplyRequest) => {
  // Check if vendorId exist
  const isVendorValid = await UserModel.findOne({ _id: supplyRequest.vendorId, userType: userTypes.VENDOR });
  if (!isVendorValid) throw new Error("البائع الذي تحاول الشراء منه غير موجود");

  // Create the supply request first
  const createdSupplyRequest = await SupplyRequestModel.create({
    ...supplyRequest,
    transportationHandler: supplyRequest.isTransportationNeeded ? userTypes.VENDOR : userTypes.USER,
  });

  // @TODO: send notification to the vendor

  return createdSupplyRequest;
});

// User only
const resendSupplyRequest = validateSchema(schemas.resendSupplyRequestSchema)(async (supplyRequest) => {
  const updatedSupplyRequest = await SupplyRequestModel.findOneAndUpdate(
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

  // @TODO: send notification to the vendor

  return updatedSupplyRequest;
});

// Vendor only
const quoteSupplyRequest = validateSchema(schemas.quoteSupplyRequestSchema)(async (quotation) => {
  // Check if all items exist on supply request
  const isSupplyRequestValid = await SupplyRequestModel.findOne({
    _id: quotation.supplyRequestId,
    "requestItems.$._id": { $all: quotation.requestItems.map((r) => ({ $elemMatch: { _id: r.itemId } })) },
  });
  console.log({ $all: quotation.requestItems.map((r) => ({ $elemMatch: { _id: r.itemId } })) });
  console.log(isSupplyRequestValid);
  // @TODO: send notification to the user
});

const listSupplyRequests = async ({ userId = null, vendorId = null, paginationToken = null }) => {
  const supplyRequests = await SupplyRequestModel.find({
    ...(paginationToken && {
      _id: {
        $gt: paginationToken,
      },
    }),
    ...(userId && { userId }),
    ...(vendorId && { vendorId }),
  });

  return supplyRequests;
};

const getSupplyRequestInfo = async (supplyRequestId) => {
  const supplyRequest = await SupplyRequestModel.findOne({ _id: supplyRequestId });
  if (!supplyRequest) throw new Error("طلب عرض السعر الذي تريد الوصول اليه غير موجود");

  return supplyRequest;
};

module.exports = {
  createSupplyRequest,
  resendSupplyRequest,
  quoteSupplyRequest,
  listSupplyRequests,
  getSupplyRequestInfo,
};
