const {
  Schema,
  model,
  Types
} = require("mongoose");

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point",
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const SupplyRequestSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  vendorId: {
    type: Types.ObjectId,
    ref: "User",
  }, //Assigned after the offer is accepted
  userLocation: {
    type: pointSchema,
    index: "2dsphere",
    required: true,
  },
  userLocationDescription: {
    type: String,
    required: true,
  },
  transportationMethod: {
    type: String,
  }, //Assigned after the offer is accepted
  supplyDate: {
    type: Date,
    required: true,
  },
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

module.exports = model("SupplyRequest", SupplyRequestSchema, "supplyRequests");