import {
	createTransaction,
	getTransactionsByUserId,
	deleteTransactionById,
	editTransactionById,
} from '../models/transactionModel.js';
import { findUserByEmail } from '../models/userModel.js';

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

// updated this to provide a bit more error checking
// should check these in the client too btw for better performance
export const addTransaction = async (req, res) => {
	try {
		const email = req.user.email;

		const existingUser = await findUserByEmail(email);

		if (!existingUser) {
			return res.status(400).json({ error: 'User does not exist' });
		}

		const { name, amount, type, EconomyType, notes } = req.body;

		if (!name || name.length > 25) {
			return res
				.status(400)
				.json({ error: 'Name is required and must be at most 25 characters' });
		}
		// shouldn't be possible to be over 50 characters but just in case
		if (!type || type.length > 50) {
			return res
				.status(400)
				.json({ error: 'Type is required and must be at most 50 characters' });
		}
		if (typeof amount !== 'number' || amount <= 0 || amount > 1000000) {
			return res.status(400).json({
				error: 'Amount must be a number between 0 and 1,000,000',
			});
		}
		// its ok if notes arent provided
		if (notes && notes.length > 65) {
			return res
				.status(400)
				.json({ error: 'Notes cannot exceed 65 characters' });
		}

		// fetch only the new transaction
		const newTransaction = await createTransaction(existingUser.id, {
			name,
			amount,
			type,
			EconomyType,
			notes,
		});

		return res.json(newTransaction);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Server error' });
	}
};

export const deleteTransaction = async (req, res) => {
	try {
		const email = req.user.email;

		const existingUser = await findUserByEmail(email);

		if (!existingUser) {
			return res.status(400).json({ error: 'User does not exist' });
		}

		// get transaction Id from request parameter
		const transactionId = req.params.id;

		if (!transactionId || isNaN(parseInt(transactionId))) {
			return res.status(400).json({ error: 'Transaction Id not valid' });
		}

		// attempt to delete transaction
		const affectedRows = await deleteTransactionById(
			transactionId,
			existingUser.id
		);

		if (affectedRows === 0) {
			// could not be found
			return res
				.status(404)
				.json({ error: 'Transaction not found or unauthorized' });
		}

		// successful deletion
		return res.status(204).send();
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Server error' });
	}
};

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
		console.error(err);
		return res.status(500).json({ error: 'Server error' });
	}
};
