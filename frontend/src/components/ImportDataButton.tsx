// frontend/src/components/ImportDataButton.tsx

import React, { useState, useRef } from 'react'; // 1. Import useRef
// Import the 'Upload' icon from lucide-react
import { Upload } from 'lucide-react';
import { Transaction } from '@/components/transaction_row';

// --- FIXES for Errors 2 & 3: Update TransactionInput Type ---
// We omit 'notes' and 'created_at' to redefine their types,
// and omit 'id' and 'user_id' as they are auto-generated/ignored during import.
type TransactionInput = Omit<
	Transaction,
	'id' | 'user_id' | 'notes' | 'created_at'
> & {
	notes: string | null; // Allows string or null (Fixes Error 2)
	created_at?: string; // Allows string or undefined (Fixes Error 3)
};

interface ImportDataButtonProps {
	// Function provided by DashboardPage to refresh data upon success
	onImportSuccess: () => void;
}

// Helper function to parse CSV into an array of TransactionInput objects
const parseCSV = (csvText: string): TransactionInput[] => {
	// Basic line splitting
	const lines = csvText.split('\n').filter((line) => line.trim() !== '');
	if (lines.length < 2) return [];

	// Skip the header row
	const dataRows = lines.slice(1);
	const transactions: TransactionInput[] = [];

	dataRows.forEach((row) => {
		// Simple split, assuming no commas within fields for this example
		// Note: For real-world robust parsing, use a library like PapaParse.
		const values = row.split(',');

		// Define expected column indices:
		// 0: Name, 1: Amount, 2: Type, 3: Economy Type, 4: Notes, 5: Created At

		// Helper to safely extract and clean a string value from the array
		const cleanValue = (index: number) =>
			values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';

		// Ensure we have at least the 4 mandatory fields
		if (values.length >= 4) {
			// --- FIX for Error 1: Using cleanValue(index) instead of values.trim() ---
			const transaction: TransactionInput = {
				name: cleanValue(0).substring(0, 25), // Index 0: Name
				amount: parseFloat(cleanValue(1)), // Index 1: Amount
				type: cleanValue(2).substring(0, 50), // Index 2: Type
				EconomyType: cleanValue(3).toLowerCase() === 'sink' ? 'Sink' : 'Source', // Index 3: Economy Type

				// Index 4: Notes (Optional, allow null)
				notes:
					values.length > 4 && cleanValue(4)
						? cleanValue(4).substring(0, 65)
						: null,

				// Index 5: Created At (Optional, allow undefined)
				created_at:
					values.length > 5 && cleanValue(5) ? cleanValue(5) : undefined,
			};

			// Basic validation
			if (
				!isNaN(transaction.amount) &&
				transaction.name &&
				transaction.type &&
				(transaction.EconomyType === 'Source' ||
					transaction.EconomyType === 'Sink')
			) {
				transactions.push(transaction);
			}
		}
	});

	return transactions;
};

export const ImportDataButton: React.FC<ImportDataButtonProps> = ({
	onImportSuccess,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	// 2. Create a ref to directly interact with the file input DOM element.
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			// --- FIX for Error 4: Use event.target.files[0] ---
			// Pass the first file object, or null if it's empty
			setFile(event.target.files[0] || null);
		}
	};

	const handleUpload = async () => {
		if (!file || isLoading) return;

		setIsLoading(true);

		const reader = new FileReader();
		reader.onload = async (e) => {
			const csvText = e.target?.result as string;
			const transactionsData = parseCSV(csvText);

			if (transactionsData.length === 0) {
				alert('No valid transactions found in the file.');
				setIsLoading(false);
				return;
			}

			try {
				// Send data to the new backend endpoint
				const results = await fetch(
					`${apiUrl}/api/dashboard/importTransactions`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							// Must use the token for authentication
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
						body: JSON.stringify({ transactions: transactionsData }),
					}
				);

				if (results.ok) {
					const data = await results.json();
					alert(
						`${data.count || transactionsData.length} transactions imported successfully.`
					);
					onImportSuccess(); // Refresh dashboard state
				} else {
					// This handles non-404 errors (e.g., 400 validation error)
					const data = await results.json();
					alert(`Import failed: ${data.error || results.statusText}`);
				}
			} catch (error) {
				console.error('Upload/Parsing Catch Error:', error);
				alert('An unexpected error occurred during upload or parsing.');
			} finally {
				setIsLoading(false);
				setFile(null); // Clear file state

				// 3. Reset the DOM input value to allow immediate re-upload.
				// This clears the file name shown in the UI and ensures the 'change'
				// event fires even if the user selects the same file again.
				if (fileInputRef.current) {
					fileInputRef.current.value = '';
				}
			}
		};
		reader.readAsText(file);
	};

	return (
		<div className="p-2 flex items-center space-x-2">
			<input
				type="file"
				accept=".csv"
				// 4. Attach the ref to the input element.
				ref={fileInputRef}
				onChange={handleFileChange}
				className="text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
			/>
			<button
				onClick={handleUpload}
				disabled={isLoading || !file}
				className={`px-4 py-2 rounded shadow transition duration-150 flex items-center space-x-2
                    ${
											isLoading || !file
												? 'bg-gray-400 text-gray-200 cursor-not-allowed'
												: 'bg-blue-600 text-white hover:bg-blue-700'
										}`}
			>
				{/* ICON ADDED: Using the Upload component from lucide-react */}
				<Upload className="h-4 w-4" />
				<span>{isLoading ? 'Importing...' : 'Import Data'}</span>
			</button>
		</div>
	);
};
