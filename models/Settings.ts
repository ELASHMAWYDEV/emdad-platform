import { Schema, model } from "mongoose";

const SettingsSchema = new Schema({}); // TODO: what settings would be here ?

export default  model("Settings", SettingsSchema, "settings");
