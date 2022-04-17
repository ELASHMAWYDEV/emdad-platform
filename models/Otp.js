const { Schema, model, Types } = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const OtpSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["phone", "email"],
    },
    otp: {
      type: Number,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

OtpSchema.virtual("id").get(() => {
  return this._id;
});

OtpSchema.plugin(mongooseLeanVirtuals);

module.exports = model("Otp", OtpSchema, "otp");
