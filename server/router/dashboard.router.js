import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import dashboardData from "../controllers/dashboard.controller.js";

const router = express.Router();

router.route("/").get(authMiddleware, dashboardData);

export default router;
