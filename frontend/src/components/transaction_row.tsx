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
import { TransactionDeletePopUp } from './transaction_delete_popup';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

// delete and edit button
import { Button } from './ui/button';
import { Trash } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { useState, useMemo } from 'react';

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

const ITEMS_PER_PAGE = 10;

export function TransactionRow({
	transactions,
	onDeleteSuccess,
	onEditSuccess,
}: TransactionRowProps) {
	// confirmation before deletion
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	const [currentPage, setCurrentPage] = useState(1);
	const [editData, setEditData] = useState<infoType>({
		open: false,
		transaction: undefined,
	});
	const [deleteData, setDeleteData] = useState<infoType>({
		open: false,
		transaction: undefined,
	});

	const [isDeleting, setIsDeleting] = useState(false);

	// Calculate pagination values
	const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentTransactions = useMemo(
		() => transactions.slice(startIndex, endIndex),
		[transactions, startIndex, endIndex]
	);

	// Reset to page 1 if current page exceeds total pages
	if (currentPage > totalPages && totalPages > 0) {
		setCurrentPage(1);
	}

	const handleDelete = async (transactionId: number) => {
		// changed this to a pop up
		if (!transactionId) return;

		setIsDeleting(true);

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
				setDeleteData({ open: false, transaction: undefined });
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
		} finally {
			setIsDeleting(false);
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

	// generate page numbers to display
	const getPageNumbers = () => {
		const pages = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				for (let i = 1; i <= 4; i++) {
					pages.push(i);
				}
				pages.push('ellipsis');
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1);
				pages.push('ellipsis');
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i);
				}
			} else {
				pages.push(1);
				pages.push('ellipsis');
				pages.push(currentPage - 1);
				pages.push(currentPage);
				pages.push(currentPage + 1);
				pages.push('ellipsis');
				pages.push(totalPages);
			}
		}

		return pages;
	};

	return (
		<div>
			<div className="m-2">
				<Card className="p-5">
					<div className="max-h-150 overflow-y-auto">
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
								{currentTransactions.length > 0 ? (
									currentTransactions.map((transaction, index) => (
										<TableRow key={transaction.id}>
											<TableCell>{startIndex + index + 1}</TableCell>
											<TableCell>{transaction.name}</TableCell>
											<TableCell style={getStyleColor(transaction.EconomyType)}>
												{getSign(transaction.EconomyType)}
												{formatCurrency(Number(transaction.amount))}
											</TableCell>
											<TableCell>{transaction.type}</TableCell>
											<TableCell>{transaction.notes}</TableCell>
											<TableCell className="text-right">
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
													}}
												>
													<Pencil></Pencil>
												</Button>

												<Button
													variant={'ghost'}
													onClick={() =>
														setDeleteData({
															open: true,
															transaction: transaction,
														})
													}
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
											colSpan={7}
											className="text-center pt-6 text-gray-500"
										>
											No transactions found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					{/* pagination component */}
					{transactions.length > 0 && (
						<div className="mt-4">
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={() =>
												setCurrentPage((prev) => Math.max(prev - 1, 1))
											}
											className={
												currentPage === 1
													? 'pointer-events-none opacity-50'
													: 'cursor-pointer'
											}
										/>
									</PaginationItem>

									{getPageNumbers().map((page, idx) =>
										page === 'ellipsis' ? (
											<PaginationItem key={`ellipsis-${idx}`}>
												<PaginationEllipsis />
											</PaginationItem>
										) : (
											<PaginationItem key={page}>
												<PaginationLink
													onClick={() => setCurrentPage(page as number)}
													isActive={currentPage === page}
													className="cursor-pointer"
												>
													{page}
												</PaginationLink>
											</PaginationItem>
										)
									)}

									<PaginationItem>
										<PaginationNext
											onClick={() =>
												setCurrentPage((prev) => Math.min(prev + 1, totalPages))
											}
											className={
												currentPage === totalPages
													? 'pointer-events-none opacity-50'
													: 'cursor-pointer'
											}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</Card>
			</div>
			<TransactionEditPopUp
				data={editData}
				closeFunction={() => {
					setEditData({ open: false, transaction: undefined });
				}}
				handleEdit={handleEdit}
			/>
			<TransactionDeletePopUp
				open={deleteData.open}
				onOpenChange={(open) =>
					setDeleteData({
						open,
						transaction: open ? deleteData.transaction : undefined,
					})
				}
				transactionName={deleteData.transaction?.name}
				onConfirm={() => {
					if (deleteData.transaction?.id !== undefined) {
						handleDelete(deleteData.transaction.id);
					}
				}}
				isDeleting={isDeleting}
			/>
		</div>
	);
}
