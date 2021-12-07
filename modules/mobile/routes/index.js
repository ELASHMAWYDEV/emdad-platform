const express = require("express");
const router = express.Router();
const {
  checkToken
} = require("../../../middlewares/jwt");

//Authenticaion
const {
  login,
  register,
  verifyOtp
} = require("../controllers/authentication");

//Profile
const {
  completeProfile,
  editProfile,
  editPassword,
  editEmail
} = require("../controllers/profile");



const tempResponse = (req, res) => res.send("Not Working Yet");

// Authentication
router.post("/auth/login", login);
router.post("/auth/register", register);
router.post("/auth/otp", checkToken, verifyOtp);

// Profile
router.post("/profile/complete", checkToken, completeProfile);
router.post("/profile/edit", checkToken, editProfile);
router.post("/profile/password", checkToken, editPassword);
router.post("/profile/email", checkToken, editEmail);

//Vendor
router.get("/vendor/home", checkToken, tempResponse);

router.get("/vendor/suppliers", checkToken, tempResponse);
router.get("/vendor/suppliers/:supplierId", checkToken, tempResponse);
router.get("/vendor/suppliers/:supplierId/products", checkToken, tempResponse);
router.get("/vendor/suppliers/:supplierId/products/:productId", checkToken, tempResponse);

router.put("/vendor/supplyRequests", checkToken, tempResponse);
router.post("/vendor/supplyRequests/:supplyRequestId/resend", checkToken, tempResponse);
router.post("/vendor/supplyRequests/:supplyRequestId/rate", checkToken, tempResponse);
router.get("/vendor/supplyRequests", checkToken, tempResponse);
router.get("/vendor/supplyRequests/:supplyRequestId", checkToken, tempResponse);

router.get("/vendor/supplyOffers", checkToken, tempResponse);
router.get("/vendor/supplyOffers/:supplyOfferId", checkToken, tempResponse);
router.post("/vendor/supplyOffers/:supplyOfferId/pay", checkToken, tempResponse);
router.get("/vendor/supplyOffers/paymentStatus/success", checkToken, tempResponse);
router.get("/vendor/supplyOffers/paymentStatus/failure", checkToken, tempResponse);

router.put("/vendor/transportationRequests", checkToken, tempResponse);
router.get("/vendor/transportationRequests", checkToken, tempResponse);
router.get("/vendor/transportationRequests/:transportationRequestId", checkToken, tempResponse);
router.post("/vendor/transportationRequests/:transportationRequestId/resend", checkToken, tempResponse);

router.get("/vendor/transportationOffers", checkToken, tempResponse);
router.get("/vendor/transportationOffers/:transportationOfferId", checkToken, tempResponse);
router.post("/vendor/transportationOffers/:transportationOfferId/pay", checkToken, tempResponse);
router.get("/vendor/transportationOffers/paymentStatus/success", checkToken, tempResponse);
router.get("/vendor/transportationOffers/paymentStatus/failure", checkToken, tempResponse);

//Supplier
router.get("/supplier/supplyRequests", checkToken, tempResponse);

router.post("/supplier/supplyOffers", checkToken, tempResponse);

router.post("/supplier/transportationRequests", checkToken, tempResponse);
router.get("/supplier/transportationOffers", checkToken, tempResponse);
router.get("/supplier/transportationOffers/:transportationOfferId", checkToken, tempResponse);
router.post("/supplier/transportationOffers/:transportationOfferId/accept", checkToken, tempResponse);
router.post("/supplier/transportationOffers/:transportationOfferId/pay", checkToken, tempResponse);
router.get("/supplier/transportationOffers/paymentStatus/success", checkToken, tempResponse);
router.get("/supplier/transportationOffers/paymentStatus/failure", checkToken, tempResponse);

router.post("/supplier/products", checkToken, tempResponse);
router.get("/supplier/products", checkToken, tempResponse);
router.get("/supplier/products/:productId", checkToken, tempResponse);
router.post("/supplier/products/:productId", checkToken, tempResponse);

//Transporter
router.get("/transporter/transportationRequests", checkToken, tempResponse);
router.get("/transporter/transportationRequests/:transportationRequestId", checkToken, tempResponse);
router.post("/transporter/transportationRequests/:transportationRequestId/changeStatus", checkToken, tempResponse);
router.post("/transporter/transportationOffers", checkToken, tempResponse);

module.exports = router;