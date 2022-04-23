const { Schema, model, Types } = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const denormalizedTransportationOfferSchema = new Schema(
  {
    offerId: {
      type: Types.ObjectId,
      ref: "TransportationOffer",
      required: true,
    },
    transporterId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    transportationRequestId: {
      type: Types.ObjectId,
      ref: "TransportationRequest",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { _id: false }
);

const TransportationOfferSchema = new Schema(
  {
    transporterId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    transportationRequestId: {
      type: Types.ObjectId,
      ref: "TransportationRequest",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

TransportationOfferSchema.virtual("id").get(function () {
  return this._id;
});

denormalizedTransportationOfferSchema.virtual("id").get(function () {
  return this._id;
});

TransportationOfferSchema.plugin(mongooseLeanVirtuals);

module.exports = model("TransportationOffer", TransportationOfferSchema, "transportationOffers");
module.exports.denormalizedTransportationOfferSchema = denormalizedTransportationOfferSchema;
