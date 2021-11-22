import { Schema, model, Types } from "mongoose";
import { supportedLanguages } from "models/constants";

const ProductSchema = new Schema({
  name: {
    type: Object.values(supportedLanguages).reduce((a, c) => ({ ...a, [c]: { type: String, required: true } }), {}), // All languages are required
    required: true,
  },
  description: {
    type: Object.values(supportedLanguages).reduce((a, c) => ({ ...a, [c]: { type: String, required: true } }), {}), // All languages are required
    required: true,
  },
  productType: {
    type: String,
    required: true, // TODO: what are the product types ?
  },
  productUnit: {
    type: String,
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
  isPriceShown: {
    type: Boolean,
    default: false,
  },
  images: {
    type: [String],
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

module.exports = model("Product", ProductSchema, "products");
