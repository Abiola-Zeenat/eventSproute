import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import validate from "../middleware/validateMiddleware.js";
import { signupSchema, loginSchema } from "../middleware/validateUser.js";

const router = express.Router();

router.post("/register", validate(signupSchema), registerUser);

router.post("/login", validate(loginSchema), loginUser);

export default router;
