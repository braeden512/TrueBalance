import React from 'react';
import { Download } from 'lucide-react';
import { Transaction } from '@/components/transaction_row';

interface ExportTransactionsButtonProps {
	// pass the full array of transactions to the button
	transactions: Transaction[];
}

// convert JSON array to CSV format
const convertToCSV = (data: Transaction[]): string => {
	if (!data || data.length === 0) return '';

	const headers = [
		'Name',
		'Amount',
		'Type',
		'Notes',
		'Date of Transaction',
	].join(',');

	const rows = data.map((item) => {
		let formattedCreatedAt = '';

		const date = new Date(item.created_at); // create a data object from the ISO string (e.g., '2025-10-25T13:11:28.000Z')

		// format the date to 'YYYY-MM-DD HH:mm:ss'
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		formattedCreatedAt = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

		// Prepare data rows
		return [
			item.name,
			item.amount,
			item.EconomyType,
			item.notes,
			// Use the newly formatted date
			formattedCreatedAt,
		].join(',');
	});

	return [headers, ...rows].join('\n');
};

// convert list of transaction objects into a csv file and trigger a download in the user browser
const handleExport = (transactions: Transaction[]) => {
	const csvString = convertToCSV(transactions);

	const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

	// a temporary link element to trigger the download
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.setAttribute('download', 'transactions_export.csv');

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(link.href);
};

// button to export user transaction data
export const ExportTransactionsButton: React.FC<
	ExportTransactionsButtonProps
> = ({ transactions }) => {
	return (
		<div className="p-2 flex justify-end">
			<button
				onClick={() => handleExport(transactions)}
				className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition duration-150 flex items-center space-x-2"
				// the button is disabled if there is no data to export
				disabled={transactions.length === 0}
			>
				<Download className="h-4 w-4" />
				<span>Export Data ({transactions.length} items)</span>
			</button>
		</div>
	);
};
