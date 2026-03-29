import express from "express";
import * as controller from "./auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();

// 🔐 Public Routes
router.post("/signup", controller.signup);   // First user → Admin + Company
router.post("/login", controller.login);     // Login
router.post("/refresh", controller.refresh); // Refresh access token

// 🔒 Protected Routes
router.post("/logout", authenticate, controller.logout);
router.get("/me", authenticate, controller.me);

export default router;
