const { Schema, model, Types } = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const FavouriteSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    favouriteVendors: {
      type: [Types.ObjectId],
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

FavouriteSchema.virtual("id").get(() => {
  return this._id;
});

FavouriteSchema.plugin(mongooseLeanVirtuals);

module.exports = model("Favourite", FavouriteSchema, "favourites");
