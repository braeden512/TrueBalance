'use client';

import AuthWrapper from '@/components/AuthWrapper';
import { StatsRow } from '@/components/stats_row';
import { Transaction, TransactionRow } from '@/components/transaction_row';
import { ChartsRow } from '@/components/charts_row';
import { TransactionHeader } from '@/components/transaction_header';
import { useEffect, useState } from 'react';
import { LineRow } from '@/components/line_row';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface PredictionData {
    data_size?: number, 
    predict_x_epoch?: number,
    predict_y_net_saving?: number,
    warning?: string,
    regression: {
        slope: number,
        intercept: number
    }
    error?: string;

}

export default function DashboardPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [predictionResult, setPredictionResult] = useState<PredictionData | null>(null);

	useEffect(() => {
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
		};

		initialFetch();
	}, []);

	// handles deletion success event from transaction row
	const handleTransactionDelete = (deletedId: number) => {
		// filter out deleted transaction from the current state
		setTransactions((prevTransactions) =>
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
	};

    // automatically fetch prediction when transaction are fetched
    useEffect(() => {
		const fetchPrediction = async () => {
			const results = await fetch(`${apiUrl}/api/dashboard/predictSaving`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			const PredictionData = await results.json();
			setPredictionResult(PredictionData);
		};

		fetchPrediction();
	}, [transactions]);

	return (
		// authwrapper ensures that they have to be logged in to see it
		<AuthWrapper>
			<div
				className="min-h-screen bg-cover bg-center"
				style={{
					backgroundImage: "url('/images/background_pattern.png')",
				}}
			>
				{/* adds x-axis padding */}
				<div className="px-4 md:px-6 lg:px-40">
					<StatsRow transactions={transactions} />

					{/* header for transaction row */}
					<TransactionHeader setTransactions={setTransactions} />

					<TransactionRow
						transactions={transactions}
						onDeleteSuccess={handleTransactionDelete}
						onEditSuccess={handleTransactionEdit}
					/>

					{/* header for charts row */}
					<div className="m-2">
						<p className="text-sm text-muted-foreground">Monthly</p>
						<h2 className="text-lg font-bold">Statistics and Graphs</h2>
					</div>

					<ChartsRow transactions={transactions} />

					{/* header for charts row */}
					<div className="m-2">
						<p className="text-sm text-muted-foreground">Monthly</p>
						<h2 className="text-lg font-bold">Transactions Over Time</h2>
					</div>
					<LineRow 
                        transactions={transactions} 
                        prediction={predictionResult}
                    />
				</div>
			</div>
		</AuthWrapper>
	);
}
