require("dotenv/config");
const mongoose = require("mongoose");



//Connect to mongodb
mongoose.connect(
  process.env.DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

//Handle connection and database errors
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(`MongoDB Error: ${err.message}`);
});

db.once("open", () => console.log("connected to DB"));
db.once("close", () => console.log("Connection to DB closed..."));