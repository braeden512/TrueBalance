import { deleteTransactionById } from '../../models/transactionModel.js';
import { findUserByEmail } from '../../models/userModel.js';

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
