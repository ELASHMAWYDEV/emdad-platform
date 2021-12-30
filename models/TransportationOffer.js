const { Schema, model, Types } = require("mongoose");

const TransportationOfferSchema = new Schema(
  {
    supplyOfferId: {
      type: Types.ObjectId,
      ref: "SupplyOffer",
      required: true,
    },
    price: {
      type: {
        beforeTax: Number,
        afterTax: Number,
      },
    },
    tax: {
      type: {
        percantage: Number,
        value: Number,
      },
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("TransportationOffer", TransportationOfferSchema, "transportationOffers");
