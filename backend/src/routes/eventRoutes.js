const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");
const { auth, adminOnly } = require("../middlewares/authMiddleware");

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", auth, adminOnly, createEvent);
router.put("/:id", auth, adminOnly, updateEvent);
router.delete("/:id", auth, adminOnly, deleteEvent);

module.exports = router;