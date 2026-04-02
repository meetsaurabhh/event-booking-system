const express = require("express");
const router = express.Router();
const { createPaymentIntent, confirmPayment } = require("../controllers/paymentController");
const { auth } = require("../middlewares/authMiddleware");

router.post("/create-intent", auth, createPaymentIntent);
router.post("/confirm", auth, confirmPayment);

module.exports = router;