import express from "express";
import { getUsers, updateUserRole } from "../controllers/user.controller.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", [protect, authorize("admin")], getUsers);

router.put("/:id/role", [protect, authorize("admin")], updateUserRole);

export default router;
