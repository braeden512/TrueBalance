import { db } from '../../config/db.js';

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
