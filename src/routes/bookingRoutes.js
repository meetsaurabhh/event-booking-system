const express = require("express");
const router = express.Router();
const { getMyBookings, createBooking } = require("../controllers/bookingController");
const { auth } = require("../middlewares/authMiddleware");

router.get("/me", auth, getMyBookings);
router.post("/", auth, createBooking);

module.exports = router;