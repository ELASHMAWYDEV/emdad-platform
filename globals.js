require("dotenv/config");
const {
  DB_URI,
  TWILIO_SID,
  TWILIO_TOKEN,
  TWILIO_SERVICE_ID,
  TWILIO_PHONE,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  WEBSITE_URL,
} = process.env;


if (!!!DB_URI) throw new Error("DB_URI is not configured in ENV");
if (!!!TWILIO_SID) throw new Error("TWILIO_SID is not configured in ENV");
if (!!!TWILIO_TOKEN) throw new Error("TWILIO_TOKEN is not configured in ENV");
if (!!!TWILIO_SERVICE_ID) throw new Error("TWILIO_SERVICE_ID is not configured in ENV");
if (!!!TWILIO_PHONE) throw new Error("TWILIO_PHONE is not configured in ENV");
if (!!!SMTP_HOST) throw new Error("SMTP_HOST is not configured in ENV");
if (!!!SMTP_PORT) throw new Error("SMTP_PORT is not configured in ENV");
if (!!!SMTP_USER) throw new Error("SMTP_USER is not configured in ENV");
if (!!!SMTP_PASS) throw new Error("SMTP_PASS is not configured in ENV");
if (!!!WEBSITE_URL) throw new Error("WEBSITE_URL is not configured in ENV");

module.exports = {
  DB_URI,
  TWILIO_SID,
  TWILIO_TOKEN,
  TWILIO_SERVICE_ID,
  TWILIO_PHONE,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  WEBSITE_URL,
};