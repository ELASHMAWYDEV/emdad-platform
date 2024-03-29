const { Schema, model, Types } = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const { transportationStatus, userTypes } = require("./constants");
const { denormalizedTransportationOfferSchema } = require("./TransportationOffer");

const TransportationRequestSchema = new Schema(
  {
    generatedId: {
      type: String,
      required: true,
      unique: true,
    },
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
      unique: true,
    },
    transportationMethod: {
      type: String,
      required: true,
    },
    transportationStatus: {
      type: String,
      enum: Object.values(transportationStatus),
      required: true,
      default: transportationStatus.AWAITING_OFFERS,
    },
    transportationOffer: { type: denormalizedTransportationOfferSchema },
    cities: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TransportationRequestSchema.virtual("id").get(function () {
  return this._id;
});

TransportationRequestSchema.virtual("transportationRequest", {
  ref: "TransportationRequest",
  localField: "transportationRequestId",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "_id transportationMethod transportationStatus transportationOffer",
  },
});

TransportationRequestSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "_id name city country oraganizationName logo location firebaseToken deviceType",
  },
});

TransportationRequestSchema.virtual("vendor", {
  ref: "User",
  localField: "vendorId",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "_id name city country oraganizationName logo location firebaseToken deviceType",
  },
});


TransportationRequestSchema.plugin(mongooseLeanVirtuals);

module.exports = model("TransportationRequest", TransportationRequestSchema, "transportationRequests");
