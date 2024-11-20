import express from "express";
import { getUsers, updateUserRole } from "../controllers/user.controller.js";
import validate from "../middleware/validateMiddleware.js";
import { updateSchema } from "../middleware/validateUser.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", [protect, admin], getUsers);

router.post(
  "/:id/role",
  validate(updateSchema),
  [protect, admin],
  updateUserRole
);

export default router;
