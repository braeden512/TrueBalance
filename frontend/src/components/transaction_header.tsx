'use client';

import { Button } from '@/components/ui/button';
import { Transaction } from './transaction_row';
import { TransactionPopup } from './transaction_popup';
import { TransactionFilterPopUp } from './transaction_filter_popup';

import { useState } from 'react';

import { Command, CommandInput } from './ui/command';

interface TransactionHeaderProps {
	setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
	handleFilterTransactions: (name: string, type?: string) => void;
	handleFilterRule: (rule: string) => void;
}

export function TransactionHeader({
	setTransactions,
	handleFilterTransactions,
	handleFilterRule,
}: TransactionHeaderProps) {
	const [open, setOpen] = useState(false);
	//const [filterOpen, setfilterOpen] = useState(false);

	console.log('refershed');

	return (
		<div className="">
			<div className="m-2 flex ">
				<div>
					<p className="text-sm text-muted-foreground">Current</p>
					<h2 className="text-lg font-bold">Recorded Transactions</h2>
				</div>

				<div className="ml-auto flex items-center gap-1.5">
					<Command className="w-40  h-9 rounded-3xl">
						<CommandInput
							placeholder="Search Name..."
							onValueChange={(e) => {
								handleFilterTransactions(e);
								//console.log(e);
							}}
						/>
					</Command>
					<TransactionFilterPopUp handleFilterRule={handleFilterRule} />

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

							//TODO re filter incase new one fits filter rules
						}
					}}
				/>
			</div>
		</div>
	);
}
