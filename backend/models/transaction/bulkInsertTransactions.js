import { db } from '../../config/db.js';

export const bulkInsertTransactions = async (transactionArray) => {
	const columns = [
		'user_id',
		'name',
		'amount',
		'type',
		'EconomyType',
		'notes',
		'created_at',
	];

	// map the array of objects into a format suitable
	const values = transactionArray.map((transaction) => [
		transaction.user_id,
		transaction.name,
		parseFloat(transaction.amount),
		transaction.type,
		transaction.EconomyType,
		transaction.notes || null,
		transaction.created_at,
	]);

	const query = `
        INSERT INTO transactions (${columns.join(', ')})
        VALUES ?
    `;

	const [rows] = await db.query(query, [values]);

	return rows;
};
