import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addTransaction, getTransactions } from "../controllers/transactionController.js";

const router = express.Router();

router.get("/verify", authMiddleware, (req, res) => {
 return res.json({ message: "This is protected data", user: req.user });
});

router.get("/transactions", authMiddleware, getTransactions)
router.post("/transaction", authMiddleware, addTransaction)


export default router;