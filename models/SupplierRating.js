const { Schema, model, Types } = require("mongoose");

const SupplierRatingSchema = new Schema({
  traderId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  supplierId: {
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

module.exports = model("SupplierRating", SupplierRatingSchema, "supplierRatings");
