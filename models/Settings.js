const { Schema, model } = require("mongoose");

const SettingsSchema = new Schema({}); // TODO: what settings would be here ?

module.exports = model("Settings", SettingsSchema, "settings");
