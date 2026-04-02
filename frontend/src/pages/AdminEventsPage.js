import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = () => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchEvents();
  }, []); // eslint-disable-line

  const handleDelete = (id) => {
    if (!window.confirm("Delete this event?")) return;
    api
      .delete(`/events/${id}`)
      .then(() => fetchEvents())
      .catch((err) => {
        alert(err.response?.data?.message || "Delete failed");
      });
  };

  return (
    <div className="page">
      <h1>Admin - Events</h1>
      <button onClick={() => navigate("/admin/events/new")}>Create Event</button>
      <table className="events-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Start</th>
            <th>Price</th>
            <th>Seats</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>{new Date(e.startDateTime).toLocaleString()}</td>
              <td>${e.price}</td>
              <td>
                {e.remainingSeats}/{e.capacity}
              </td>
              <td>
                <Link to={`/admin/events/${e._id}`}>Edit</Link>
                {" | "}
                <button onClick={() => handleDelete(e._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEventsPage;