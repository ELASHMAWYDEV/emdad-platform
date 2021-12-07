const {
  Schema,
  model,
  Types
} = require("mongoose");
const {
  supportedLanguages
} = require("./constants");

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  // productType: {
  //   type: String,
  //   required: true, // TODO: what are the product types ?
  // },
  units: {
    type: [{
      productUnit: {
        type: String,
        required: true,
      },
      pricePerUnit: {
        type: Number,
        required: true
      },
    }]
  },
  isPriceShown: {
    type: Boolean,
    default: false,
  },
  images: {
    type: [String],
    required: true
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
  }
});

module.exports = model("Product", ProductSchema, "products");