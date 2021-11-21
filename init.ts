import "dotenv/config";
import mongoose, { ConnectOptions } from "mongoose";

//Connect to mongodb
mongoose.connect(
  process.env.DB_URI as string,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions
);

//Handle connection and database errors
const db = mongoose.connection;

db.on("error", (err: any) => {
  console.log(`MongoDB Error: ${err.message}`);
});

db.once("open", () => console.log("connected to DB"));
db.once("close", () => console.log("Connection to DB closed..."));
