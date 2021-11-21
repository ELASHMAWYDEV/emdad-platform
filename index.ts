import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 5000;
const app = express();

// //Init
import "./init";

//Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// //API
// app.use("/api", require("./routes"));

app.get("/", (req, res) => {
  return res.send("Working Fine!");
});

/*********************************************************/

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
