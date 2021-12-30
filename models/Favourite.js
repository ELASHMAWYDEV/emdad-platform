const { Schema, model, Types } = require("mongoose");

const FavouriteSchema = new Schema(
  {
    userId: {
      type: [Types.ObjectId],
      ref: "User",
      require: true,
    },
    favouriteVendors: {
      type: [Types.ObjectId],
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Favourite", FavouriteSchema, "favourites");
