import { editTransactionById } from '../../models/transaction/index.js';
import { findUserByEmail } from '../../models/user/index.js';

export const editTransaction = async (req, res) => {
	try {
		const email = req.user.email;

		const existingUser = await findUserByEmail(email);

		if (!existingUser) {
			return res.status(400).json({ error: 'User does not exist' });
		}

		const transactionId = req.params.id;

		if (!transactionId || isNaN(parseInt(transactionId))) {
			return res.status(400).json({ error: 'Transaction Id not valid' });
		}

		const { name, amount, type, EconomyType, notes } = req.body;

		if (!name || name.length > 25) {
			return res
				.status(400)
				.json({ error: 'Name is required and must be at most 25 characters' });
		}

		if (!type || type.length > 50) {
			return res
				.status(400)
				.json({ error: 'Type is required and must be at most 50 characters' });
		}
		console.log(typeof amount, amount);
		if (typeof amount !== 'number' || amount <= 0 || amount > 1000000) {
			return res.status(400).json({
				error: 'Amount must be a number between 0 and 1,000,000',
			});
		}

		if (notes && notes.length > 65) {
			return res
				.status(400)
				.json({ error: 'Notes cannot exceed 65 characters' });
		}

		const newTransaction = await editTransactionById(
			transactionId,
			existingUser.id,
			{
				name,
				amount,
				type,
				EconomyType,
				notes,
			}
		);

		return res.json(newTransaction);
	} catch (err) {
		return res.status(500).json({ error: 'Server error' });
	}
};
