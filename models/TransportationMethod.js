const { Schema, model, Types } = require("mongoose");

const TransportationMethodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("TransportationMethod", TransportationMethodSchema, "transportationMethods");
