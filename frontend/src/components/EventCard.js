import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      {event.imageUrl && <img src={event.imageUrl} alt={event.title} />}
      <h3>{event.title}</h3>
      <p>{event.location}</p>
      <p>
        {new Date(event.startDateTime).toLocaleString()} -{" "}
        {new Date(event.endDateTime).toLocaleTimeString()}
      </p>
      <p>Price: ${event.price}</p>
      <p>
        Remaining Seats: {event.remainingSeats} / {event.capacity}
      </p>
      <Link to={`/events/${event._id}`}>View Details</Link>
    </div>
  );
};

export default EventCard;