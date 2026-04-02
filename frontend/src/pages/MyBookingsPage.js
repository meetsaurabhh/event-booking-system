import React, { useEffect, useState } from "react";
import api from "../services/api";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api
      .get("/bookings/me")
      .then((res) => setBookings(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="page">
      <h1>My Bookings</h1>
      {bookings.length === 0 && <p>No bookings found.</p>}
      <ul className="booking-list">
        {bookings.map((b) => (
          <li key={b._id}>
            <strong>{b.eventId?.title}</strong> — {b.numTickets} tickets — $
            {b.totalAmount} — {b.paymentStatus}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBookingsPage;