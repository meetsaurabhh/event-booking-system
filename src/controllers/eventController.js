const Event = require("../models/Event");

const getEvents = async (req, res) => {
  try {
    const { date, category } = req.query;
    const query = {};
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.startDateTime = { $gte: start, $lt: end };
    }
    if (category) query.category = category;
    const events = await Event.find(query).sort({ startDateTime: 1 });
    return res.json(events);
  } catch (err) {
    console.error("Get events error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json(event);
  } catch (err) {
    console.error("Get event error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      startDateTime,
      endDateTime,
      price,
      capacity,
      imageUrl
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      location,
      startDateTime,
      endDateTime,
      price,
      capacity,
      remainingSeats: capacity,
      imageUrl,
      createdBy: req.user._id
    });

    return res.status(201).json(event);
  } catch (err) {
    console.error("Create event error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const updates = { ...req.body };
    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) delete updates[key];
    });

    const oldCapacity = event.capacity;
    const oldRemaining = event.remainingSeats;
    const alreadyBooked = Math.max(oldCapacity - oldRemaining, 0);

    if (updates.capacity !== undefined) {
      updates.capacity = Number(updates.capacity);
    }

    if (updates.remainingSeats !== undefined) {
      updates.remainingSeats = Number(updates.remainingSeats);
      if (Number.isNaN(updates.remainingSeats)) {
        return res.status(400).json({ message: "remainingSeats must be a valid number" });
      }

      const effectiveCapacity =
        updates.capacity !== undefined ? updates.capacity : oldCapacity;

      if (updates.remainingSeats < 0 || updates.remainingSeats > effectiveCapacity) {
        return res.status(400).json({ message: "remainingSeats must be between 0 and capacity" });
      }
    } else if (updates.capacity !== undefined) {
      // If capacity changes and remaining seats are not explicitly provided,
      // keep the already-booked count stable and recalculate remaining seats.
      updates.remainingSeats = Math.max(updates.capacity - alreadyBooked, 0);
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    return res.json(updatedEvent);
  } catch (err) {
    console.error("Update event error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Delete event error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };