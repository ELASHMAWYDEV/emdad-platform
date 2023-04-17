const { Schema, model, Types } = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const NotificationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
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


NotificationSchema.virtual("id").get(() => {
  return this._id;
}

);

NotificationSchema.plugin(mongooseLeanVirtuals);

module.exports = model("Notification", NotificationSchema, "notifications");