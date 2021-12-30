const { Schema, model, Types } = require("mongoose");

const ProductRatingSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      max: 5,
      min: 0,
    },
    comment: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = model("ProductRating", ProductRatingSchema, "productRatings");
