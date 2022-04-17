const { Schema, model, Types } = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");



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
    default: null,
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


ProductSchema.virtual("id").get(() => {
  return this._id;
});

ProductSchema.plugin(mongooseLeanVirtuals);

module.exports = model("Product", ProductSchema, "products");
module.exports.denormalizedProductSchema = denormalizedProductSchema;
