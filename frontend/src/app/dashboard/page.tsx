'use client';

import AuthWrapper from '@/components/AuthWrapper';
import { StatsRow } from '@/components/stats_row';
import { Transaction, TransactionRow } from '@/components/transaction_row';
import { ChartsRow } from '@/components/charts_row';
import { TransactionHeader } from '@/components/transaction_header';
import { useEffect, useState } from 'react';
import { LineRow } from '@/components/line_row';
import { LineHeader } from '@/components/line_header';
import { ExportTransactionsButton } from '@/components/ExportTransactionsButton';
import { ImportDataButton } from '@/components/ImportDataButton';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface PredictionData {
	data_size?: number;
	predict_x_epoch?: number;
	predict_y_net_saving?: number;
	warning?: string;
	regression: {
		slope: number;
		intercept: number;
	};
	error?: string;
}

interface FilterRules {
	name: string;
	type: string;
}

export default function DashboardPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [displayedTransactions, setDisplayed] = useState<Transaction[]>([]);

	const [filterRules, setFilterRules] = useState<FilterRules>({
		name: '',
		type: '',
	});

	const [predictionResult, setPredictionResult] =
		useState<PredictionData | null>(null);

	// state for prediction date
	const [predictionDate, setPredictionDate] = useState<Date | undefined>(
		undefined
	);

	// fetch the data to populate transaction table
	const initialFetch = async () => {
		const results = await fetch(`${apiUrl}/api/dashboard/getTransactions`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});

		const data = await results.json();
		setTransactions(data.transactions);
		setDisplayed(data.transactions);
	};

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			initialFetch();
		}
	}, []);

	// Fetch prediction when transactions change OR when prediction date changes
	useEffect(() => {
		if (!predictionDate) return;

		const fetchPrediction = async () => {
			// calculate the epoch time to send to backend
			const targetEpoch = predictionDate.getTime();
			const lastTransactionEpoch =
				transactions.length > 0
					? Math.max(
							...transactions.map((t) => new Date(t.created_at).getTime())
						)
					: Date.now();

			// calculate offset from last transaction
			const epochOffset = targetEpoch - lastTransactionEpoch;

			const results = await fetch(
				`${apiUrl}/api/dashboard/predictSaving?epochOffset=${epochOffset}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);

			const PredictionData = await results.json();
			setPredictionResult(PredictionData);
		};

		fetchPrediction();
	}, [transactions, predictionDate]);

	useEffect(() => {
		setDisplayed(
			transactions.filter((transaction) => {
				if (filterRules.type !== '') {
					return (
						transaction.type === filterRules.type &&
						new RegExp(filterRules.name.toLowerCase()).test(
							transaction.name.toLowerCase()
						)
					);
				}
				return new RegExp(filterRules.name.toLowerCase()).test(
					transaction.name.toLowerCase()
				);
			})
		);
	}, [filterRules, transactions]);

	// handles deletion success event from transaction row
	const handleTransactionDelete = (deletedId: number) => {
		// filter out deleted transaction from the current state
		setTransactions((prevTransactions) =>
			prevTransactions.filter(
				(transactionData) => transactionData.id !== deletedId
			)
		);

		setDisplayed((prevTransactions) =>
			prevTransactions.filter(
				(transactionData) => transactionData.id !== deletedId
			)
		);
	};

	const handleTransactionEdit = (editedTransaction: Transaction) => {
		setTransactions((prevTransactions) =>
			prevTransactions.map((transaction) =>
				transaction.id === editedTransaction.id
					? editedTransaction
					: transaction
			)
		);

		setDisplayed((prevTransactions) =>
			prevTransactions.map((transaction) =>
				transaction.id === editedTransaction.id
					? editedTransaction
					: transaction
			)
		);
	};

	const handleFilterRule = (type: string) =>
		setFilterRules({ name: filterRules.name, type: type });

	const handleFilterTransactions = (name: string) =>
		setFilterRules({ name: name, type: filterRules.type });

	// handler for when date changes in LineHeader
	const handleDateChange = (date: Date | undefined) => {
		setPredictionDate(date);
	};

	// convert the selected date to epoch milliseconds
	const predictionEpoch = predictionDate ? predictionDate.getTime() : undefined;

	return (
		// authwrapper ensures that they have to be logged in to see it
		<AuthWrapper>
			<div
				className="min-h-screen  bg-cover bg-center   py-1 "
				style={{
					backgroundImage: "url('/images/background_pattern.png')",
				}}
			>
				{/* adds x-axis padding */}
				<div className="px-4 md:px-6 lg:px-40">
					<StatsRow transactions={transactions} />

					<div className="flex justify-end">
						<ImportDataButton onImportSuccess={initialFetch}></ImportDataButton>
						<ExportTransactionsButton transactions={transactions} />
					</div>

					{/* header for transaction row */}
					<TransactionHeader
						setTransactions={setTransactions}
						handleFilterTransactions={handleFilterTransactions}
						handleFilterRule={handleFilterRule}
					/>
					{/* would like to add a tooltip here like on the line chart header */}
					{/* gonna wait to see what yall think though */}

					<TransactionRow
						transactions={displayedTransactions}
						onDeleteSuccess={handleTransactionDelete}
						onEditSuccess={handleTransactionEdit}
					/>

					{/* header for charts row */}
					<div className="m-2">
						<h2 className="text-lg font-bold">Category Distribution</h2>
						<p className="text-sm text-muted-foreground">
							Analysis of Last 30 Days
						</p>
						{/* would like to add a tooltip here like on the line chart header */}
						{/* gonna wait to see what yall think though */}
					</div>

					<ChartsRow transactions={transactions} />

					<LineHeader
						onDateChange={handleDateChange}
						transactions={transactions}
					/>
					<LineRow
						transactions={transactions}
						prediction={{
							predict_x_epoch: predictionEpoch,
							predict_y_net_saving: predictionResult?.predict_y_net_saving,
						}}
					/>
				</div>
			</div>
		</AuthWrapper>
	);
}
