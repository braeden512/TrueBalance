import { findUserByEmail } from '../../models/user/index.js';
import { bulkInsertTransactions } from '../../models/transaction/index.js';

export const importTransactions = async (req, res) => {
	try {
		const email = req.user.email;

		const existingUser = await findUserByEmail(email);

		if (!existingUser) {
			return res.status(400).json({ error: 'User does not exist' });
		}

		const userId = existingUser.id;
		const transactionsToInsert = req.body.transactions;

		if (
			!transactionsToInsert ||
			!Array.isArray(transactionsToInsert) ||
			transactionsToInsert.length === 0
		) {
			return res
				.status(400)
				.json({ error: 'Invalid or empty transaction array provided.' });
		}

		// map data to include user_id and enforce schema limits
		const formattedData = transactionsToInsert.map((t) => ({
			user_id: userId,
			// valid data type and character size to match the database
			name: String(t.name).substring(0, 25),
			amount: parseFloat(t.amount),
			type: String(t.type).substring(0, 50),
			EconomyType: t.EconomyType === 'Sink' ? 'Sink' : 'Source',
			notes: t.notes ? String(t.notes).substring(0, 65) : null,
			created_at: t.created_at,
		}));

		const result = await bulkInsertTransactions(formattedData);

		return res.json({
			message: `${result.affectedRows} transactions imported successfully.`,
			count: result.affectedRows,
		});
	} catch (err) {
		console.error('Import Error:', err);
		return res.status(500).json({
			error:
				'Server error during transaction import. Check server logs for details.',
		});
	}
};
