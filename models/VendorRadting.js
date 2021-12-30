const { Schema, model, Types } = require("mongoose");

const VendorRatingSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendorId: {
      type: Types.ObjectId,
      ref: "User",
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

module.exports = model("VendorRating", VendorRatingSchema, "vendorRatings");
