const {
  Schema,
  model,
  Types
} = require("mongoose");

const OtpSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["phone", "email"]
  },
  otp: {
    type: Number,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Otp", OtpSchema, "otp");