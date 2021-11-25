import express from "express";
const router = express.Router();

const tempResponse = (req, res) => res.send("Not Working Yet");

// Authentication & Profile
router.post("/auth/login", tempResponse);
router.post("/auth/register", tempResponse);
router.post("/auth/otp/phone", tempResponse);
router.post("/auth/otp/email", tempResponse);
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

router.post("/vendor/supplyRequests", tempResponse);
router.post("/vendor/supplyRequests/:supplyRequestId/resend", tempResponse);
router.post("/vendor/supplyRequests/:supplyRequestId/rate", tempResponse);
router.get("/vendor/supplyRequests", tempResponse);
router.get("/vendor/supplyRequests/:supplyRequestId", tempResponse);

router.get("/vendor/supplyOffers", tempResponse);
router.get("/vendor/supplyOffers/:supplyOfferId", tempResponse);
router.post("/vendor/supplyOffers/:supplyOfferId/pay", tempResponse);
router.get("/vendor/supplyOffers/paymentStatus/success", tempResponse);
router.get("/vendor/supplyOffers/paymentStatus/failure", tempResponse);

router.post("/vendor/transportationRequests", tempResponse);
router.get("/vendor/transportationRequests", tempResponse);
router.get("/vendor/transportationRequests/:transportationRequestId", tempResponse);
router.post("/vendor/transportationRequests/:transportationRequestId/resend", tempResponse);

router.get("/vendor/transportationOffers", tempResponse);
router.get("/vendor/transportationOffers/:transportationOfferId", tempResponse);
router.post("/vendor/transportationOffers/:transportationOfferId/pay", tempResponse);
router.get("/vendor/transportationOffers/paymentStatus/success", tempResponse);
router.get("/vendor/transportationOffers/paymentStatus/failure", tempResponse);

export default router;
