import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";
const PORT = process.env.PORT || 5000;
const app = express();
import dashboardRoutes from "./modules/dashboard/routes";
import mobileRoutes from "./modules/mobile/routes";

// Init
import "./init";

//Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// API
app.use("/api/mobile", mobileRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  return res.send("Working Fine!");
});

app.use((err, req, res, next) => {
  if (err) {
    return res.json({ status: false, message: err.message });
  }
});

/*********************************************************/

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

module.exports.handler = serverless(app);
