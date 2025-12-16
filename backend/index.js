import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { db } from './config/db.js';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
app.use(helmet());
app.use(express.json());

app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
	})
);

// health check endpoint
app.get('/health', (req, res) => {
	res.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
	});
});

// database connection test endpoint
if (process.env.NODE_ENV !== 'production') {
	// can only be accessed in non-production environments (sensitive info)
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
}

// rate limiter
const generalLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 100, // 100 requests per minute per IP
	message: 'Too many requests from this IP.',
});

// routes
app.use('/api', generalLimiter);
app.use('/api', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
