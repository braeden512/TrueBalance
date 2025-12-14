import express from 'express';
import cors from 'cors';
import { db } from './config/db.js';

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
app.use(express.json());

app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
	})
);

// health check endpoint (no database required)
app.get('/health', (req, res) => {
	res.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV,
		port: process.env.PORT,
	});
});

// database connection test endpoint
app.get('/test-db', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT 1 + 1 AS result');
		res.json({
			success: true,
			result: rows[0].result,
			message: 'Database connected!',
			dbHost: process.env.DB_HOST,
			dbName: process.env.DB_NAME,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
			code: error.code,
		});
	}
});

// routes
app.use('/api', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
