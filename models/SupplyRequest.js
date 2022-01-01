const { Schema, model, Types } = require("mongoose");
const { supplyRequestStatus, userTypes } = require("./constants");
const { denormalizedProductSchema } = require("./Product");

const AdditionalItemSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: null,
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
      default: null,
    },
    requestStatus: {
      type: String,
      required: true,
      enum: Object.values(supplyRequestStatus),
      default: supplyRequestStatus.AWAITING_QUOTATION,
    },
    transportationHandler: {
      type: String,
      required: true,
      enum: Object.values(userTypes),
    },
    transportationRequestId: {
      type: Types.ObjectId,
      ref: "TransportationRequest",
      default: null,
    },
    requestItems: [denormalizedProductSchema],
    additionalItems: [AdditionalItemSchema],
    transportationPrice: {
      type: Number,
    },
    totalRequestPriceWithTax: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = model("SupplyRequest", SupplyRequestSchema, "supplyRequests");
