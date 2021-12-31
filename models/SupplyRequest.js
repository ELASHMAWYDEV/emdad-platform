const { Schema, model, Types } = require("mongoose");

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

const SupplyRequestSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendorId: {
      type: Types.ObjectId,
      ref: "User",
    },
    transportationMethod: {
      type: String,
    }, //Assigned after the offer is accepted
  },
  { timestamps: true }
);

module.exports = model("SupplyRequest", SupplyRequestSchema, "supplyRequests");
