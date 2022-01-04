const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const app = express();
const dashboardRoutes = require("./modules/dashboard/routes");
const mobileRoutes = require("./modules/mobile/routes");
const ApiError = require("./errors/ApiError");
const { errorCodes } = require("./errors");

// Init
require("./globals");
require("./init");

//Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

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

//Serve images --> static
app.get("/images/:path/:image", (req, res, next) => {
  try {
    //Check if file exists
    if (fs.existsSync(path.join(__dirname, "images", req.params.path, req.params.image))) {
      return res.sendFile(path.join(__dirname, "images", req.params.path, req.params.image));
    } else if (fs.existsSync(path.join(__dirname, "images", req.params.path, "default.png"))) {
      return res.sendFile(path.join(__dirname, "images", req.params.path, "default.png"));
    } else {
      return res.sendFile(path.join(__dirname, "images", "404.png"));
    }
  } catch (e) {
    next(e);
  }
});

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    // API or Custom Error
    return sendErrorResponse(res, err);
  } else if (err.code == 11000) {
    // Duplication Error
    return sendErrorResponse(
      res,
      new ApiError(errorCodes.DUPLICATION_ERROR, [
        {
          key: Object.keys(err.keyValue)[0],
          message: "هذا الحقل مسجل لدينا مسبقا ولا يمكن تسجيله مرة أخري",
        },
      ])
    );
  } else {
    return sendErrorResponse(res, new ApiError(errorCodes.UNKOWN_ERROR, err.message));
  }
});

/*********************************************************/

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
