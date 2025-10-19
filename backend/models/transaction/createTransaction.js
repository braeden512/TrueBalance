import { db } from '../../config/db.js';

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
