import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [numTickets, setNumTickets] = useState(1);
  const [booking, setBooking] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch(console.error);
  }, [id]);

  const handleCreateBooking = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    api
      .post("/bookings", { eventId: id, numTickets })
      .then((res) => {
        setBooking(res.data);
        navigate(`/checkout/${res.data._id}`);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Error creating booking");
      });
  };

  if (!event) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>{event.location}</p>
      <p>
        {new Date(event.startDateTime).toLocaleString()} -{" "}
        {new Date(event.endDateTime).toLocaleTimeString()}
      </p>
      <p>Price: ${event.price}</p>
      <p>
        Remaining Seats: {event.remainingSeats} / {event.capacity}
      </p>

      <div className="booking-form">
        <label>
          Tickets:
          <input
            type="number"
            min="1"
            max={event.remainingSeats}
            value={numTickets}
            onChange={(e) => setNumTickets(Number(e.target.value))}
          />
        </label>
        <button onClick={handleCreateBooking} disabled={event.remainingSeats === 0}>
          {event.remainingSeats === 0 ? "Sold Out" : "Book Now"}
        </button>
      </div>
    </div>
  );
};

export default EventDetailPage;