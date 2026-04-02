import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutInner = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/bookings/me")
      .then((res) => {
        const b = res.data.find((x) => x._id === bookingId);
        setBooking(b || null);
      })
      .catch(console.error);

    api
      .post("/payments/create-intent", { bookingId })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch(console.error);
  }, [bookingId]);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement
      }
    });

    if (error) {
      alert(error.message || "Payment failed");
      setLoading(false);
      return;
    }

    api
      .post("/payments/confirm", { bookingId })
      .then(() => {
        alert("Payment successful");
        navigate("/my-bookings");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to confirm payment");
      })
      .finally(() => setLoading(false));
  };

  if (!booking) return <div className="page">Loading booking...</div>;

  return (
    <div className="page">
      <h1>Checkout</h1>
      <p>
        Booking for {booking.eventId?.title} — {booking.numTickets} tickets — $
        {booking.totalAmount}
      </p>
      <form className="form" onSubmit={handlePay}>
        <CardElement />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutInner />
  </Elements>
);

export default CheckoutPage;