import dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });

import mysql from 'mysql2/promise';

export const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,

	// dont open and close db connection every time, just keep pool of connections for reuse
	waitForConnections: true,
	connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
	queueLimit: 0,
});
