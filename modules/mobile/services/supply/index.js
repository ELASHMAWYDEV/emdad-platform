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

const quoteSupplyRequest = validateSchema(schemas.quoteSupplyRequestSchema)(async (quotation) => {
  // Check if all items exist on supply request
  const isSupplyRequestValid = await SupplyRequestModel.findOne({
    _id: quotation.supplyRequestId,
    "requestItems.$._id": { $all: quotation.requestItems.map((r) => r.productId) },
  });

  console.log(isSupplyRequestValid);
});

module.exports = { createSupplyRequest, quoteSupplyRequest };
