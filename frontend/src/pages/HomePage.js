import React, { useEffect, useState } from "react";
import api from "../services/api";
import EventCard from "../components/EventCard";

const HomePage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events").then((res) => setEvents(res.data)).catch(console.error);
  }, []);

  return (
    <div className="page">
      <h1>Upcoming Events</h1>
      <div className="event-grid">
        {events.map((e) => (
          <EventCard key={e._id} event={e} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;