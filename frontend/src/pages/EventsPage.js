import React, { useEffect, useState } from "react";
import api from "../services/api";
import EventCard from "../components/EventCard";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState("");

  const fetchEvents = () => {
    api
      .get("/events", { params: { date: date || undefined } })
      .then((res) => setEvents(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchEvents();
  }, []); // eslint-disable-line

  return (
    <div className="page">
      <h1>All Events</h1>
      <div className="filters">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={fetchEvents}>Filter</button>
      </div>
      <div className="event-grid">
        {events.map((e) => (
          <EventCard key={e._id} event={e} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;