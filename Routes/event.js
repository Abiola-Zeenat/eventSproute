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
import { protect, authorize } from "../middleware/authMiddleware.js";

import upload from "../lib/upload.js";
const router = express.Router();

router.post(
  "/",
  [protect, authorize("organizer")],
  createEvent
);
router.post(
  "/upload",
  [protect, authorize("organizer")],
  upload.single("banner"),
  uploadBanner
);
router.get("/", getEvents);
router.get("/:id", getEvent);
router.put(
  "/:id",
  protect,
  authorize("organizer"),
  updateEvent
);
router.delete("/:id", protect, deleteEvent);
router.post("/:id/notify", sendEmail);

export default router;
