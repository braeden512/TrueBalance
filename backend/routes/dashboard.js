import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  editTransaction,
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/verify', authMiddleware, (req, res) => {
  //req.user {id=userid,email=email}
  return res.json({ message: 'This is protected data', user: req.user });
});

router.get('/getTransactions', authMiddleware, getTransactions);
router.post('/addTransaction', authMiddleware, addTransaction);
router.delete('/deleteTransaction/:id', authMiddleware, deleteTransaction);
router.put('/editTransaction/:id', authMiddleware, editTransaction);

export default router;
