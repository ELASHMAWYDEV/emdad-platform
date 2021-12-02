import { Schema, model, Types } from "mongoose";

const HelpRequestSchema = new Schema({
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

export default  model("HelpRequest", HelpRequestSchema, "transportationMethods");
