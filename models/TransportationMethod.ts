import { Schema, model, Types } from "mongoose";

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

export default  model("TransportationMethod", TransportationMethodSchema, "transportationMethods");
