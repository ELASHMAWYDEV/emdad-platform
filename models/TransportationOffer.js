const {
  Schema,
  model,
  Types
} = require("mongoose");

const TransportationOfferSchema = new Schema({
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

module.exports = model("TransportationOffer", TransportationOfferSchema, "transportationOffers");