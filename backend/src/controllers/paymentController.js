const Stripe = require("stripe");
const Booking = require("../models/Booking");
const Event = require("../models/Event");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100), // amount in cents
      currency: "usd",
      metadata: { bookingId: booking._id.toString(), userId: req.user._id.toString() }
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Create payment intent error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const confirmPayment = async (req, res) => {
  // In a real app you'd handle this via Stripe webhooks.
  // For this assignment, we simply mark the booking paid and decrement seats.
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.paymentStatus === "paid") {
      return res.json({ message: "Already paid" });
    }

    const event = await Event.findById(booking.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.remainingSeats < booking.numTickets) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    booking.paymentStatus = "paid";
    booking.bookingStatus = "confirmed";
    await booking.save();

    event.remainingSeats -= booking.numTickets;
    await event.save();

    return res.json({ message: "Payment confirmed and booking updated" });
  } catch (err) {
    console.error("Confirm payment error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createPaymentIntent, confirmPayment };
