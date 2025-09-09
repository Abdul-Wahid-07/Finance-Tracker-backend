import express from "express";
import {generateReport} from "../controllers/pdf.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect with auth so only logged-in users can download
router.get("/report", authMiddleware, generateReport);

export default router;
