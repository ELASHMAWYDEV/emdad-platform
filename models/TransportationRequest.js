const { Schema, model, Types } = require("mongoose");
const { transportationStatus, userTypes } = require("./constants");

const TransportationRequestSchema = new Schema(
  {
    requesterType: {
      type: String,
      required: true,
      enum: Object.values(userTypes),
    },
    requesterId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    supplyRequestId: {
      type: Types.ObjectId,
      ref: "SupplyRequest",
      required: true,
    },
    transportationStatus: {
      type: String,
      enum: Object.values(transportationStatus),
      required: true,
      default: transportationStatus.PENDING,
    },
    transportationOfferId: {
      type: Types.ObjectId,
      ref: "TransportationOffer",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("TransportationRequest", TransportationRequestSchema, "transportationOffers");
