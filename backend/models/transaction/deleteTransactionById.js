import { db } from '../../config/db.js';

export const deleteTransactionById = async (transactionId, userId) => {
	const [result] = await db.query(
		// delete transaction
		'DELETE FROM transactions WHERE id = ? AND user_id = ?',
		[transactionId, userId]
	);

	// return 1 if a transaction was deleted, otherwise 0
	return result.affectedRows;
};
