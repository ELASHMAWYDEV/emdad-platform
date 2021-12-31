const express = require("express");
const router = express.Router();

//middlewares
const { checkToken } = require("../../../middlewares/jwt");
const userMiddleware = require("../../../middlewares/userMiddleware");
const vendorMiddleware = require("../../../middlewares/vendorMiddleware");
const transporterMiddleware = require("../../../middlewares/transporterMiddleware");

// Controllers
const authenticationController = require("../controllers/authentication");
const profileController = require("../controllers/profile");
const userController = require("../controllers/user");
const vendorController = require("../controllers/vendor");
const settingsController = require("../controllers/settings");

const tempResponse = (req, res) => res.send("Not Working Yet");

// Authentication
router.post("/auth/login", authenticationController.login);
router.post("/auth/register", authenticationController.register);
router.post("/auth/otp", checkToken, authenticationController.verifyOtp);
router.post("/auth/otp/resend", checkToken, authenticationController.resendOtp);

// Profile
router.post("/profile/complete", checkToken, profileController.completeProfile);
router.post("/profile/edit", checkToken, profileController.editProfile);
router.post("/profile/password", checkToken, profileController.editPassword);
router.post("/profile/email", checkToken, profileController.editEmail);

//User
router.get("/user/home", checkToken, userMiddleware, userController.getHomeData);

router.get("/user/vendors", checkToken, userMiddleware, userController.getListOfVendors);
router.get("/user/vendors/:vendorId", checkToken, userMiddleware, userController.getVendorInfo);
router.post("/user/vendors/:vendorId/favourite", checkToken, userMiddleware, userController.addVendorToFavourites);
router.post("/user/vendors/:vendorId/rate", checkToken, userMiddleware, userController.rateVendor);
router.get("/user/vendors/:vendorId/products", checkToken, userMiddleware, userController.getVendorProducts);
router.get("/user/vendors/products/:productId", checkToken, userMiddleware, userController.getProductInfo);

router.put("/user/supplyRequests", checkToken, userMiddleware, tempResponse);
router.post("/user/supplyRequests/:supplyRequestId/resend", checkToken, userMiddleware, tempResponse);
router.post("/user/supplyRequests/:supplyRequestId/rate", checkToken, userMiddleware, tempResponse);
router.get("/user/supplyRequests", checkToken, userMiddleware, tempResponse);
router.get("/user/supplyRequests/:supplyRequestId", checkToken, userMiddleware, tempResponse);

router.get("/user/supplyOffers", checkToken, userMiddleware, tempResponse);
router.get("/user/supplyOffers/:supplyOfferId", checkToken, userMiddleware, tempResponse);
router.post("/user/supplyOffers/:supplyOfferId/pay", checkToken, userMiddleware, tempResponse);
router.get("/user/supplyOffers/paymentStatus/success", checkToken, userMiddleware, tempResponse);
router.get("/user/supplyOffers/paymentStatus/failure", checkToken, userMiddleware, tempResponse);

router.put("/user/transportationRequests", checkToken, userMiddleware, tempResponse);
router.get("/user/transportationRequests", checkToken, userMiddleware, tempResponse);
router.get("/user/transportationRequests/:transportationRequestId", checkToken, userMiddleware, tempResponse);
router.post("/user/transportationRequests/:transportationRequestId/resend", checkToken, userMiddleware, tempResponse);

router.get("/user/transportationOffers", checkToken, userMiddleware, tempResponse);
router.get("/user/transportationOffers/:transportationOfferId", checkToken, userMiddleware, tempResponse);
router.post("/user/transportationOffers/:transportationOfferId/pay", checkToken, userMiddleware, tempResponse);
router.get("/user/transportationOffers/paymentStatus/success", checkToken, userMiddleware, tempResponse);
router.get("/user/transportationOffers/paymentStatus/failure", checkToken, userMiddleware, tempResponse);

//Vendor
router.get("/vendor/supplyRequests", checkToken, tempResponse);

router.post("/vendor/supplyOffers", checkToken, tempResponse);

router.post("/vendor/transportationRequests", checkToken, tempResponse);
router.get("/vendor/transportationOffers", checkToken, tempResponse);
router.get("/vendor/transportationOffers/:transportationOfferId", checkToken, tempResponse);
router.post("/vendor/transportationOffers/:transportationOfferId/accept", checkToken, tempResponse);
router.post("/vendor/transportationOffers/:transportationOfferId/pay", checkToken, tempResponse);
router.get("/vendor/transportationOffers/paymentStatus/success", checkToken, tempResponse);
router.get("/vendor/transportationOffers/paymentStatus/failure", checkToken, tempResponse);

router.post("/vendor/products", checkToken, vendorController.addProduct);
router.get("/vendor/products", checkToken, tempResponse);
router.get("/vendor/products/:productId", checkToken, tempResponse);
router.post("/vendor/products/:productId", checkToken, tempResponse);

//Transporter
router.get("/transporter/transportationRequests", checkToken, tempResponse);
router.get("/transporter/transportationRequests/:transportationRequestId", checkToken, tempResponse);
router.post("/transporter/transportationRequests/:transportationRequestId/changeStatus", checkToken, tempResponse);
router.post("/transporter/transportationOffers", checkToken, tempResponse);

//Global
router.get("/settings", settingsController.liseSettings);
router.post("/images", settingsController.uploadImages);

module.exports = router;
