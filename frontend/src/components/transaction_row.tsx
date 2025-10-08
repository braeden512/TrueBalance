import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card } from './ui/card';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { TransactionEditPopUp } from './transaction_edit_popup';

// delete and edit button
import { Button } from './ui/button';
import { Trash } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

// format used to import the transactions from a particular user

export interface transactionBody {
	name: string;
	amount: number;
	type: string;
	EconomyType: 'Source' | 'Sink';
	notes: string;
}

export interface Transaction extends transactionBody {
	id: number;
	created_at: string;
}

interface TransactionRowProps {
	transactions: Transaction[];

	// update parent state after successful deletion
	onDeleteSuccess: (deletedTransactionId: number) => void;
	onEditSuccess: (editedTransaction: Transaction) => void;
}

interface infoType {
	open: boolean;
	transaction: Transaction | undefined;
}

const getStyleColor = (type: 'Source' | 'Sink') => ({
	// was backwards... should be good now
	color: type === 'Source' ? 'limegreen' : 'red',
});
const getSign = (type: 'Source' | 'Sink') => (type === 'Source' ? '+' : '-');

export function TransactionRow({
	transactions,
	onDeleteSuccess,
	onEditSuccess,
}: TransactionRowProps) {
	// confirmation before deletion
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	const [editData, setEditData] = useState<infoType>({
		open: false,
		transaction: undefined,
	});

	const handleDelete = async (transactionId: number) => {
		// maybe should change this to a pop up
		if (!window.confirm('Are you sure you want to delete this transaction?')) {
			return;
		}

		try {
			const res = await fetch(
				`${apiUrl}/api/dashboard/deleteTransaction/${transactionId}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);

			// success
			if (res.status === 204) {
				onDeleteSuccess(transactionId);
			} else {
				const errorData = await res.json();
				console.error('Failed to delete transaction', errorData.error);
				alert(
					`Failed to delete transaction: ${errorData.error || 'Server error'}`
				);
			}
		} catch (err) {
			console.error(err);
			alert('Unexpected error occurred during deletion');
		}
	};

	const handleEdit = async (editedTransaction: transactionBody) => {
		return new Promise<void>((resolve, reject) => {
			if (!editData.transaction) {
				reject('Failed to edit transaction');
				return;
			}
			fetch(
				`${apiUrl}/api/dashboard/editTransaction/${editData.transaction.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
					body: JSON.stringify(editedTransaction),
				}
			).then(async (res) => {
				const updatedTransaction = await res.json();
				if (res.ok) {
					onEditSuccess(updatedTransaction);
					resolve();
					return;
				}
				reject(updatedTransaction.error || 'Failed to edit transaction');
			});
		});
	};

	return (
		<div>
			<div className="m-2">
				<Card className="p-5">
					<div className="max-h-96 overflow-y-auto">
						<Table>
							<TableHeader className="w-full border-b bg-white shadow-sm">
								<TableRow>
									<TableHead className="w-[70px]">#</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Notes</TableHead>
									<TableHead className="text-right">
										Date of Transaction
									</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{transactions.length > 0 ? (
									transactions.map((transaction, index) => (
										<TableRow key={transaction.id}>
											{/* transaction.id is an easy way for us to identify what transaction it is from ANY user*/}
											{/* for example, if two users both make a new transaction, the transaction.id from the second user would say... */}
											{/* 2, even though that user hadn't created a transaction yet. this is why we shouldn't use transaction.id for the line below too*/}
											<TableCell>{index + 1}</TableCell>
											<TableCell>{transaction.name}</TableCell>
											<TableCell style={getStyleColor(transaction.EconomyType)}>
												{getSign(transaction.EconomyType)}
												{formatCurrency(Number(transaction.amount))}
											</TableCell>
											<TableCell>{transaction.type}</TableCell>
											<TableCell>{transaction.notes}</TableCell>
											<TableCell className="text-right">
												{/* look in utils folder to find this file (just formats the date correctly) */}
												{formatDate(transaction.created_at)}
											</TableCell>

											<TableCell className="space-x-2 text-right">
												<Button
													variant={'ghost'}
													onClick={() => {
														setEditData({
															open: true,
															transaction: transaction,
														});
														//setEditOpen(true);
													}}
												>
													<Pencil></Pencil>
												</Button>

												<Button
													variant={'ghost'}
													onClick={() => handleDelete(transaction.id)}
													className="hover:bg-red-100"
												>
													<Trash className="text-red-500"></Trash>
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center pt-6 text-gray-500"
										>
											No transactions found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</Card>
			</div>
			<TransactionEditPopUp
				data={editData}
				closeFunction={() => {
					setEditData({ open: false, transaction: undefined });
				}}
				handleEdit={handleEdit}
			/>
		</div>
	);
}
