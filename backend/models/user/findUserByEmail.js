import { db } from '../../config/db.js';

export const findUserByEmail = async (email) => {
	const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
	return rows[0];
};
