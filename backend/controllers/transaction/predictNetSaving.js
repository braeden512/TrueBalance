// this file just handles the request/response cycle and calls the service for the regression logic
// DOESNT HANDLE REGRESSION LOGIC

import { getPredictionByUserId } from '../../models/transaction/index.js';
import { findUserByEmail } from '../../models/user/index.js';
import { predictNetSavingFromTransactions } from '../../services/predictionService.js';

export const predictNetSaving = async (req, res) => {
	try {
		const email = req.user.email;
		const existingUser = await findUserByEmail(email);

		if (!existingUser) {
			return res.status(400).json({ error: 'User does not exist' });
		}

		// fetch data for prediction
		const result = await getPredictionByUserId(existingUser.id);

		// get epochTime from query or default to next month
		const lastEpoch =
			result.length > 0
				? Math.max(...result.map((t) => new Date(t.created_at).getTime()))
				: Date.now();
		// lastEpoch is the most recent transaction time, or now if no transactions
		const epochOffset =
			// just converts from query string to number, defaults to 1 month
			Number(req.query.epochOffset) || 30 * 24 * 60 * 60 * 1000;
		const epochTime = lastEpoch + epochOffset;

		const prediction = predictNetSavingFromTransactions(result, epochTime);

		return res.json(prediction);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Server error' });
	}
};
