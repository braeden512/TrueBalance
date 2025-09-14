import { db } from '../config/db.js';

export const createTransaction = async (userId, transactionData) => {
  const { name, amount, type, EconomyType, notes } = transactionData;

  await db.query(
    'INSERT INTO transactions (user_id, name, amount, type, EconomyType, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, name, amount, type, EconomyType, notes]
  );
};

export const getTransactionsByUserId = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM transactions WHERE user_id = ?',
    [userId]
  );
  return rows;
};
