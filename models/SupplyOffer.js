const {
  Schema,
  model,
  Types
} = require("mongoose");

const SupplyOfferSchema = new Schema({
  vendorId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  supplyRequestId: {
    type: Types.ObjectId,
    ref: "SupplyRequest",
    required: true,
  },
  supplyDate: {
    type: Date,
    required: true,
  },
  serviceType: {
    type: String, // TODO: what are the service types ?
  },
  serviceDescription: {
    type: String, // TODO: what is the service description ?
  },
  userNotes: {
    type: String,
  },
  vendorNotes: {
    type: String,
  },
  // TODO: add the products details here
  creationDate: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  modificationDate: {
    type: Date,
  },
  modifiedBy: {
    type: Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("SupplyOffer", SupplyOfferSchema, "supplyOffers");