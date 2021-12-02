const express = require("express");
const router = express.Router();

//Controllers
const {
  login,
  register
} = require("../controllers/authentication");

const tempResponse = (req, res) => res.send("Not Working Yet");

// Authentication
router.post("/auth/login", login);
router.post("/auth/register", register);
router.post("/auth/otp/phone", tempResponse);
router.post("/auth/otp/email", tempResponse);

// Profile
router.post("/profile/complete", tempResponse);
router.post("/profile/edit", tempResponse);
router.post("/profile/editPassword", tempResponse);
router.post("/profile/editEmail", tempResponse);

//Vendor
router.get("/vendor/home", tempResponse);

router.get("/vendor/suppliers", tempResponse);
router.get("/vendor/suppliers/:supplierId", tempResponse);
router.get("/vendor/suppliers/:supplierId/products", tempResponse);
router.get("/vendor/suppliers/:supplierId/products/:productId", tempResponse);

router.put("/vendor/supplyRequests", tempResponse);
router.post("/vendor/supplyRequests/:supplyRequestId/resend", tempResponse);
router.post("/vendor/supplyRequests/:supplyRequestId/rate", tempResponse);
router.get("/vendor/supplyRequests", tempResponse);
router.get("/vendor/supplyRequests/:supplyRequestId", tempResponse);

router.get("/vendor/supplyOffers", tempResponse);
router.get("/vendor/supplyOffers/:supplyOfferId", tempResponse);
router.post("/vendor/supplyOffers/:supplyOfferId/pay", tempResponse);
router.get("/vendor/supplyOffers/paymentStatus/success", tempResponse);
router.get("/vendor/supplyOffers/paymentStatus/failure", tempResponse);

router.put("/vendor/transportationRequests", tempResponse);
router.get("/vendor/transportationRequests", tempResponse);
router.get("/vendor/transportationRequests/:transportationRequestId", tempResponse);
router.post("/vendor/transportationRequests/:transportationRequestId/resend", tempResponse);

router.get("/vendor/transportationOffers", tempResponse);
router.get("/vendor/transportationOffers/:transportationOfferId", tempResponse);
router.post("/vendor/transportationOffers/:transportationOfferId/pay", tempResponse);
router.get("/vendor/transportationOffers/paymentStatus/success", tempResponse);
router.get("/vendor/transportationOffers/paymentStatus/failure", tempResponse);

//Supplier
router.get("/supplier/supplyRequests", tempResponse);

router.post("/supplier/supplyOffers", tempResponse);

router.post("/supplier/transportationRequests", tempResponse);
router.get("/supplier/transportationOffers", tempResponse);
router.get("/supplier/transportationOffers/:transportationOfferId", tempResponse);
router.post("/supplier/transportationOffers/:transportationOfferId/accept", tempResponse);
router.post("/supplier/transportationOffers/:transportationOfferId/pay", tempResponse);
router.get("/supplier/transportationOffers/paymentStatus/success", tempResponse);
router.get("/supplier/transportationOffers/paymentStatus/failure", tempResponse);

router.post("/supplier/products", tempResponse);
router.get("/supplier/products", tempResponse);
router.get("/supplier/products/:productId", tempResponse);
router.post("/supplier/products/:productId", tempResponse);

//Transporter
router.get("/transporter/transportationRequests", tempResponse);
router.get("/transporter/transportationRequests/:transportationRequestId", tempResponse);
router.post("/transporter/transportationRequests/:transportationRequestId/changeStatus", tempResponse);
router.post("/transporter/transportationOffers", tempResponse);

module.exports = router;