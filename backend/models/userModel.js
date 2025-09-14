import { db } from '../config/db.js';

// create a user in the database
export const createUser = async (email, hashedPassword) => {
  const [result] = await db.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword]
  );
  return result.insertId;
};

//TODO big problem with this because two people can have the same email
// shouldn't be a problem... userController has a check for duplicate emails, so it wont be possible

// find user by their email (mostly for validation)
export const findUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};
