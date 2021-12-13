const {
  Schema,
  model,
  Types
} = require("mongoose");
const {
  supportedLanguages
} = require("./constants");

const ProductSchema = new Schema({
  vendorId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    required: true,
  },
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
    required: true,
    minlength: 1
  },
  notes: {
    type: String,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },

  modificationDate: {
    type: Date,
  }
});

module.exports = model("Product", ProductSchema, "products");