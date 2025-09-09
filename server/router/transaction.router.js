import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import Transaction from "../controllers/transaction.controller.js";

const router = express.Router();

router.route("/add").post(authMiddleware, Transaction.addTransaction);
router.route("/delete/:id").delete(authMiddleware, Transaction.deleteTransaction);
router.route("/update/:id").put(authMiddleware, Transaction.updateTransaction);

export default router;
