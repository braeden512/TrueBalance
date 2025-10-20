import { getTransactionsByUserId } from '../../models/transaction/index.js';
import { findUserByEmail } from '../../models/user/index.js';

export const getTransactions = async (req, res) => {
	try {
		const email = req.user.email;

		const existingUser = await findUserByEmail(email);

		if (!existingUser) {
			return res.status(400).json({ error: 'User does not exist' });
		}

		const result = await getTransactionsByUserId(existingUser.id);

		return res.json({ transactions: result });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Server error' });
	}
};
