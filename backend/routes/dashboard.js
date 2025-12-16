import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

import {
	addTransaction,
	getTransactions,
	deleteTransaction,
	editTransaction,
	predictNetSaving,
	importTransactions,
} from '../controllers/transaction/index.js';

import { promptAi } from '../controllers/ai/index.js';

const router = express.Router();

const aiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 10 requests per windowMs
	message: 'Too many requests, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
});

router.get('/verify', authMiddleware, (req, res) => {
	//req.user {id=userid,email=email}
	return res.json({ message: 'This is protected data', user: req.user });
});

router.get('/getTransactions', authMiddleware, getTransactions);
router.post('/addTransaction', authMiddleware, addTransaction);
router.delete('/deleteTransaction/:id', authMiddleware, deleteTransaction);
router.put('/editTransaction/:id', authMiddleware, editTransaction);
router.get('/predictSaving', authMiddleware, predictNetSaving);
router.post('/importTransactions', authMiddleware, importTransactions);
router.put('/promptAi', authMiddleware, aiLimiter, promptAi);

export default router;
