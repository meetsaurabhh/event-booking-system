import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const AdminEventFormPage = () => {
  const { id } = useParams(); // "new" or existing id
  const navigate = useNavigate();
  const isEdit = id && id !== "new";

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other",
    location: "",
    startDateTime: "",
    endDateTime: "",
    price: 0,
    capacity: 0,
    remainingSeats: "",
    imageUrl: ""
  });

  useEffect(() => {
    if (isEdit) {
      api
        .get(`/events/${id}`)
        .then((res) => {
          const e = res.data;
          setForm({
            title: e.title,
            description: e.description || "",
            category: e.category || "other",
            location: e.location,
            startDateTime: e.startDateTime.slice(0, 16),
            endDateTime: e.endDateTime.slice(0, 16),
            price: e.price,
            capacity: e.capacity,
            remainingSeats: e.remainingSeats,
            imageUrl: e.imageUrl || ""
          });
        })
        .catch(console.error);
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      capacity: Number(form.capacity)
    };

    if (isEdit) {
      if (form.remainingSeats !== "") {
        payload.remainingSeats = Number(form.remainingSeats);
      }
    } else {
      delete payload.remainingSeats;
    }

    const request = isEdit
      ? api.put(`/events/${id}`, payload)
      : api.post("/events", payload);

    request
      .then(() => {
        navigate("/admin/events");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Save failed");
      });
  };

  return (
    <div className="page">
      <h1>{isEdit ? "Edit Event" : "Create Event"}</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
        <label>
          Category:
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="concert">Concert</option>
            <option value="conference">Conference</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Start:
          <input
            type="datetime-local"
            name="startDateTime"
            value={form.startDateTime}
            onChange={handleChange}
          />
        </label>
        <label>
          End:
          <input
            type="datetime-local"
            name="endDateTime"
            value={form.endDateTime}
            onChange={handleChange}
          />
        </label>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
        />
        {isEdit && (
          <input
            type="number"
            min="0"
            name="remainingSeats"
            placeholder="Remaining Seats"
            value={form.remainingSeats}
            onChange={handleChange}
          />
        )}
        <input
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AdminEventFormPage;