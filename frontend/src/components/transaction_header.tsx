'use client';

import { Button } from '@/components/ui/button';
import { Transaction } from './transaction_row';
import { TransactionPopup } from './transaction_popup';
import { TransactionFilterPopUp } from './transaction_filter_popup';

import { useState } from 'react';

import { ListFilter } from 'lucide-react';

interface TransactionHeaderProps {
	setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export function TransactionHeader({ setTransactions }: TransactionHeaderProps) {
	const [open, setOpen] = useState(false);
	const [filterOpen, setfilterOpen] = useState(false);

	return (
		<div className="m-2 flex items-center gap-1">
			<div>
				<p className="text-sm text-muted-foreground">Current</p>
				<h2 className="text-lg font-bold">Recorded Transactions</h2>
			</div>

			<div className="ml-auto flex items-center gap-1.5">
				<Button
					variant="outline"
					size="icon"
					onClick={() => setfilterOpen(true)}
				>
					<ListFilter />
				</Button>

				<Button
					variant="default"
					size="lg"
					className="px-3"
					onClick={() => setOpen(true)}
				>
					Add Transaction
				</Button>
			</div>

			<TransactionPopup
				open={open}
				onOpenChange={setOpen}
				onSubmit={(newTransaction) => {
					if (setTransactions) {
						// put the newest transaction at the top
						setTransactions((prev) => [newTransaction, ...prev]);
					}
				}}
			/>

			<TransactionFilterPopUp open={filterOpen} onOpenChange={setfilterOpen} />
		</div>
	);
}
