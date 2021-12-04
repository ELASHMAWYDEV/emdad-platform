require("dotenv/config");
const {
  DB_URI,
  TWILIO_SID,
  TWILIO_TOKEN,
  TWILIO_SERVICE_ID,
  TWILIO_PHONE
} = process.env;


if (!!!DB_URI) throw new Error("DB_URI is not configured in ENV");
if (!!!TWILIO_SID) throw new Error("TWILIO_SID is not configured in ENV");
if (!!!TWILIO_TOKEN) throw new Error("TWILIO_TOKEN is not configured in ENV");
if (!!!TWILIO_SERVICE_ID) throw new Error("TWILIO_SERVICE_ID is not configured in ENV");
if (!!!TWILIO_PHONE) throw new Error("TWILIO_PHONE is not configured in ENV");

module.exports = {
  DB_URI,
  TWILIO_SID,
  TWILIO_TOKEN,
  TWILIO_SERVICE_ID,
  TWILIO_PHONE,
};