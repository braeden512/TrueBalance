import { db } from '../../config/db.js';

export const getTransactionsByUserId = async (userId) => {
	const [rows] = await db.query(
		// for now I just made it so that it shows most recent first
		'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
		[userId]
	);
	return rows;
};
