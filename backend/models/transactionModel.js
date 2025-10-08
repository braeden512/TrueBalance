import { db } from '../config/db.js';

//should probably wrap all these for errors
export const createTransaction = async (userId, transactionData) => {
	const { name, amount, type, EconomyType, notes } = transactionData;

	const [result] = await db.query(
		'INSERT INTO transactions (user_id, name, amount, type, EconomyType, notes) VALUES (?, ?, ?, ?, ?, ?)',
		[userId, name, amount, type, EconomyType, notes]
	);

	// fetch the new row with its id
	const [rows] = await db.query('SELECT * FROM transactions WHERE id = ?', [
		result.insertId,
	]);

	return rows[0];
};

export const getTransactionsByUserId = async (userId) => {
	const [rows] = await db.query(
		// for now I just made it so that it shows most recent first
		'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
		[userId]
	);
	return rows;
};

export const editTransactionById = async (
	transactionId,
	userId,
	transactionData
) => {
	const { name, amount, type, EconomyType, notes } = transactionData;

	const [result] = await db.query(
		'UPDATE transactions SET name = ?, amount = ?, type = ?, EconomyType = ?, notes = ? WHERE id = ? AND user_id = ?',
		[name, amount, type, EconomyType, notes, transactionId, userId]
	);

	const [rows] = await db.query(
		'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
		[transactionId, userId]
	);

	return rows[0];
};

export const deleteTransactionById = async (transactionId, userId) => {
	const [result] = await db.query(
		// delete transaction
		'DELETE FROM transactions WHERE id = ? AND user_id = ?',
		[transactionId, userId]
	);

	// return 1 if a transaction was deleted, otherwise 0
	return result.affectedRows;
};
