import express from "express";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  sendEmail,
  updateEvent,
  uploadBanner,
} from "../controllers/event.controller.js";
import { protect, organizer } from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
  createEventSchema,
  updateEventSchema,
} from "../middleware/validateEvent.js";
import upload from "../lib/upload.js";
const router = express.Router();

router.post(
  "/",
  [protect, organizer],
  validate(createEventSchema),
  createEvent
);
router.post(
  "/upload",
  [protect, organizer],
  upload.single("banner"),
  uploadBanner
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
