import express from "express";
import authcontrollers from "../controllers/auth.controller.js";
import schema from "../validators/auth.validator.js";
import validate from "../middlewares/validate.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").get(authcontrollers.home);
router.route("/register").post( validate(schema.signupSchema), authcontrollers.register);
router.route("/login").post( validate(schema.loginSchema),authcontrollers.login);
router.route("/contact").post( validate(schema.contactSchema),authcontrollers.contact);
router.route("/user").get( authMiddleware, authcontrollers.user);

export default router;
