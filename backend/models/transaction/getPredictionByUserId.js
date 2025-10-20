import { db } from '../../config/db.js';

export const getPredictionByUserId = async (userId) => {
	const [rows] = await db.query(
		// start from first transaction user made
		'SELECT * FROM transactions WHERE user_id = ?',
		[userId]
	);
	return rows;
};
