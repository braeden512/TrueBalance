'use client';

import { Button } from '@/components/ui/button';
import { Transaction } from './transaction_row';
import { TransactionPopup } from './transaction_popup';
import { TransactionFilterPopUp } from './transaction_filter_popup';

import { useState, useEffect, useRef } from 'react';

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
	const [searchValue, setSearchValue] = useState('');
	const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

	// debounce the filter function (basically wait until user stops typing)
	useEffect(() => {
		// clear existing timeout
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}

		// set new timeout
		debounceTimeout.current = setTimeout(() => {
			handleFilterTransactions(searchValue);
		}, 300); // 300ms delay

		// cleanup
		return () => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}
		};
	}, [searchValue]);

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
							value={searchValue}
							onValueChange={(e) => {
								setSearchValue(e);
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
						}
					}}
				/>
			</div>
		</div>
	);
}
