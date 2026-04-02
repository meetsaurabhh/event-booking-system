const Booking = require("../models/Booking");
const Event = require("../models/Event");

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate("eventId");
    return res.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const createBooking = async (req, res) => {
  try {
    const { eventId, numTickets } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.remainingSeats < numTickets) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const totalAmount = event.price * numTickets;

    const booking = await Booking.create({
      userId: req.user._id,
      eventId,
      numTickets,
      totalAmount,
      paymentStatus: "pending",
      bookingStatus: "confirmed"
    });

    return res.status(201).json(booking);
  } catch (err) {
    console.error("Create booking error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMyBookings, createBooking };