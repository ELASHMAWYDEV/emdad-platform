import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 5000;
const app = express();
import dashboardRoutes from "./modules/dashboard/routes";
import mobileRoutes from "./modules/mobile/routes";
import ApiError from "./errors/ApiError";
import AjvError from "./errors/AjvError";
import { errorCodes } from "./errors";

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

const sendErrorResponse = (res, err: ApiError) => {
  return res.status(err.statusCode || 500).json({
    status: false,
    message: err.message,
    code: err.errorCode,
    details: err.details,
  });
};

app.use((err: ApiError | AjvError, req, res, next) => {
  if (err instanceof ApiError) {
    return sendErrorResponse(res, new ApiError(err.errorCode, err.details));
  } else {
    return sendErrorResponse(res, new ApiError(errorCodes.UNKOWN_ERROR, undefined));
  }
});

/*********************************************************/

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
