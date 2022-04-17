const { Schema, model, Types } = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const { supplyRequestStatus, userTypes, paymentStatus } = require("./constants");
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
    generatedId: {
      type: String,
      required: true,
      unique: true,
    },
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
    paymentStatus: {
      type: String,
      enum: Object.values(paymentStatus),
      default: paymentStatus.UNPAID,
    },
    estimationInSeconds: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

SupplyRequestSchema.virtual("id").get(() => {
  return this._id;
});

SupplyRequestSchema.plugin(mongooseLeanVirtuals);

module.exports = model("SupplyRequest", SupplyRequestSchema, "supplyRequests");
