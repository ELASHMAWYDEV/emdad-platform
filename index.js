const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const app = express();
const dashboardRoutes = require("./modules/dashboard/routes");
const mobileRoutes = require("./modules/mobile/routes");
const ApiError = require("./errors/ApiError");
const {
  errorCodes
} = require("./errors");

// Init
require("./init");

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

const sendErrorResponse = (res, err) => {
  return res.status(err.statusCode || 500).json({
    status: false,
    message: err.message,
    code: err.errorCode,
    details: err.details,
  });
};

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return sendErrorResponse(res, new ApiError(err.errorCode, err.details));
  } else {
    return sendErrorResponse(res, new ApiError(errorCodes.UNKOWN_ERROR, undefined));
  }
});

/*********************************************************/

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));