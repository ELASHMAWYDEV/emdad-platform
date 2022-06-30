const express = require("express");
const router = express.Router();

//middlewares
const { checkToken } = require("../../../middlewares/jwt");
const guestMiddleware = require("../../../middlewares/guestMiddleware");
const userMiddleware = require("../../../middlewares/userMiddleware");
const vendorMiddleware = require("../../../middlewares/vendorMiddleware");
const transporterMiddleware = require("../../../middlewares/transporterMiddleware");

// Controllers
const authenticationController = require("../controllers/authentication");
const profileController = require("../controllers/profile");
const userController = require("../controllers/user");
const vendorController = require("../controllers/vendor");
const transporterController = require("../controllers/transporter");
const settingsController = require("../controllers/settings");

const tempResponse = (req, res) => res.send("Not Working Yet");

// Authentication
router.post("/auth/login", authenticationController.login);
router.post("/auth/register", authenticationController.register);
router.post("/auth/otp", checkToken, authenticationController.verifyOtp);
router.post("/auth/otp/resend", checkToken, authenticationController.resendOtp);
router.post("/auth/registerGuest", authenticationController.registerGuest);

// Profile
router.get("/profile", checkToken, profileController.getUserProfile);
router.post("/profile/complete", checkToken, profileController.completeProfile);
router.post("/profile/edit", checkToken, profileController.editProfile);
router.post("/profile/password", checkToken, profileController.editPassword);
router.post("/profile/email", checkToken, profileController.editEmail);

//User
router.get("/user/home", checkToken, guestMiddleware, userMiddleware, userController.getHomeData);

router.get("/user/vendors", checkToken, guestMiddleware, userMiddleware, userController.getListOfVendors);
router.get(
  "/user/vendors/favourite",
  checkToken,
  guestMiddleware,
  userMiddleware,
  userController.getListOfFavouriteVendors
);
router.get("/user/vendors/:vendorId", checkToken, guestMiddleware, userMiddleware, userController.getVendorInfo);
router.post("/user/vendors/:vendorId/favourite", checkToken, userMiddleware, userController.toggleVendorToFavourites);
router.post("/user/vendors/:vendorId/rate", checkToken, userMiddleware, userController.rateVendor);
router.get(
  "/user/vendors/:vendorId/products",
  checkToken,
  guestMiddleware,
  userMiddleware,
  userController.getVendorProducts
);
router.get(
  "/user/vendors/products/:productId",
  checkToken,
  guestMiddleware,
  userMiddleware,
  userController.getProductInfo
);

router.put("/user/supplyRequests", checkToken, userMiddleware, userController.createSupplyRequest);
router.get("/user/supplyRequests/:supplyRequestId", checkToken, userMiddleware, userController.getSupplyRequestInfo);
router.post(
  "/user/supplyRequests/:supplyRequestId/resend",
  checkToken,
  userMiddleware,
  userController.resendSupplyRequest
);
router.post(
  "/user/supplyRequests/:supplyRequestId/accept",
  checkToken,
  userMiddleware,
  userController.acceptSupplyRequest
);
router.get("/user/supplyRequests", checkToken, userMiddleware, userController.listSupplyRequests);

// router.get("/user/supplyRequests/paymentStatus/success", checkToken, userMiddleware, tempResponse);
// router.get("/user/supplyRequests/paymentStatus/failure", checkToken, userMiddleware, tempResponse);

router.put("/user/transportationRequests", checkToken, userMiddleware, userController.createTransportationRequest);
router.get(
  "/user/transportationRequests/:transportationRequestId/transportationOffers",
  checkToken,
  userMiddleware,
  vendorController.listTransportationOffers
);
router.post(
  "/user/transportationOffers/:transportationOfferId",
  checkToken,
  userMiddleware,
  userController.acceptTransportationOffer
);
router.get(
  "/user/transportationOffers/:transportationOfferId",
  checkToken,
  userMiddleware,
  userController.getTransportationOfferInfo
);
// router.get("/user/transportationRequests", checkToken, userMiddleware, tempResponse);
router.get("/user/transportationRequests/:transportationRequestId", checkToken, userMiddleware, tempResponse);
router.post("/user/transportationRequests/:transportationRequestId/resend", checkToken, userMiddleware, tempResponse);

router.get("/user/transportationOffers", checkToken, userMiddleware, tempResponse);
router.get("/user/transportationOffers/:transportationOfferId", checkToken, userMiddleware, tempResponse);
router.post("/user/transportationOffers/:transportationOfferId/pay", checkToken, userMiddleware, tempResponse);
router.get("/user/transportationOffers/paymentStatus/success", checkToken, userMiddleware, tempResponse);
router.get("/user/transportationOffers/paymentStatus/failure", checkToken, userMiddleware, tempResponse);

//Vendor
router.post(
  "/vendor/supplyRequests/:supplyRequestId",
  checkToken,
  vendorMiddleware,
  vendorController.quoteSupplyRequest
);
router.get("/vendor/supplyRequests", checkToken, vendorMiddleware, vendorController.listSupplyRequests);
router.get(
  "/vendor/supplyRequests/:supplyRequestId",
  checkToken,
  vendorMiddleware,
  vendorController.getSupplyRequestInfo
);

router.put(
  "/vendor/transportationRequests",
  checkToken,
  vendorMiddleware,
  vendorController.createTransportationRequest
);
router.get(
  "/vendor/transportationRequests/:transportationRequestId/transportationOffers",
  checkToken,
  vendorMiddleware,
  vendorController.listTransportationOffers
);
router.post(
  "/vendor/transportationOffers/:transportationOfferId",
  checkToken,
  vendorMiddleware,
  vendorController.acceptTransportationOffer
);
router.get(
  "/vendor/transportationOffers/:transportationOfferId",
  checkToken,
  vendorMiddleware,
  vendorController.getTransportationOfferInfo
);
router.post("/vendor/transportationOffers/:transportationOfferId/pay", checkToken, vendorMiddleware, tempResponse);
router.get("/vendor/transportationOffers/paymentStatus/success", checkToken, vendorMiddleware, tempResponse);
router.get("/vendor/transportationOffers/paymentStatus/failure", checkToken, vendorMiddleware, tempResponse);

router.put("/vendor/products", checkToken, vendorMiddleware, vendorController.addProduct);
router.get("/vendor/products", checkToken, vendorMiddleware, vendorController.listProducts);
router.get("/vendor/products/:productId", checkToken, vendorMiddleware, vendorController.getProductDetails);
router.post("/vendor/products/:productId", checkToken, vendorMiddleware, vendorController.editProduct);

//Transporter
router.get(
  "/transporter/transportationRequests",
  checkToken,
  transporterMiddleware,
  transporterController.listTransportationRequests
);
router.get(
  "/transporter/transportationOrders",
  checkToken,
  transporterMiddleware,
  transporterController.listAcceptedTransportationRequests
);
router.get(
  "/transporter/transportationRequests/:transportationRequestId",
  checkToken,
  transporterMiddleware,
  transporterController.getTransportationRequestDetails
);
router.post(
  "/transporter/transportationRequests/:transportationRequestId/changeStatus",
  checkToken,
  transporterMiddleware,
  tempResponse
);
router.put(
  "/transporter/transportationOffers",
  checkToken,
  transporterMiddleware,
  transporterController.createTransportationOffer
);

//Global
router.get("/settings", settingsController.liseSettings);
router.post("/images", settingsController.uploadImages);

module.exports = router;
