import { db } from '../../config/db.js';

export const createUser = async (email, hashedPassword) => {
	const [result] = await db.query(
		'INSERT INTO users (email, password) VALUES (?, ?)',
		[email, hashedPassword]
	);
	return result.insertId;
};
