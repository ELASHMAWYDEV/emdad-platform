const { Schema, model, Types } = require("mongoose");
const denormalizedProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  productUnit: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const ProductSchema = new Schema(
  {
    vendorId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
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
      type: [
        {
          productUnit: {
            type: String,
            required: true,
          },
          pricePerUnit: {
            type: Number,
            required: true,
          },
          minimumAmountPerOrder: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    isPriceShown: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      required: true,
      minlength: 1,
      default: ["default.png"],
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("Product", ProductSchema, "products");
