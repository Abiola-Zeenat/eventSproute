// Email Notifications:
// Send email to users about an event:
// POST /api/events/:id/notify
// Sends an email to all registered users about the event.
import express from "express";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  sendEmail,
  updateEvent,
} from "../controllers/event.controller.js";
import { protect, organizer } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
  createEventSchema,
  updateEventSchema,
} from "../middleware/validateEvent.js";
const router = express.Router();

router.post(
  "/",
  [protect, organizer],
  validate(createEventSchema),
  createEvent
);
router.get("/", getEvents);
router.get("/:id", getEvent);
router.put(
  "/:id",
  validate(updateEventSchema),
  protect,
  organizer,
  updateEvent
);
router.delete("/:id", protect, deleteEvent);
router.post("/:id/notify", sendEmail);

export default router;
