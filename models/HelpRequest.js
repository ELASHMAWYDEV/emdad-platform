const { Schema, model, Types } = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const HelpRequestSchema = new Schema(
  {
    fromUserId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
    },
    questionDate: {
      type: Date,
      default: Date.now,
    },
    answer: {
      type: String,
    },
    answerDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

HelpRequestSchema.virtual("id").get(() => {
  return this._id;
});

HelpRequestSchema.plugin(mongooseLeanVirtuals);

module.exports = model("HelpRequest", HelpRequestSchema, "transportationMethods");
