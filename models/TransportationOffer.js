const { Schema, model, Types } = require("mongoose");

const TransportationOfferSchema = new Schema(
  {
    transporterId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    supplyRequestId: {
      type: Types.ObjectId,
      ref: "SupplyRequest",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("TransportationOffer", TransportationOfferSchema, "transportationOffers");
