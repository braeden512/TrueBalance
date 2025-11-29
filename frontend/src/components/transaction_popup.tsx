'use client';

// SMALL ISSUE: when you open the popup, the scrollbar forces it a bit left, making it look kinda weird
// not sure how to fix this yet

import expenses from '../data/expenses.json';
import incomes from '../data/incomes.json';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AmountInput } from './ui/amount-input';
import { Input } from './ui/input';
import { useEffect, useState } from 'react';
import { Transaction } from './transaction_row';

// interface for type of transaction (json file)
interface type {
	type: string;
}
interface TransactionPopupProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit?: (transaction: Transaction) => void;
}

const expenseCategories: type[] = expenses as type[];
const incomeCategories: type[] = incomes as type[];

export function TransactionPopup({
	open,
	onOpenChange,
	onSubmit,
}: TransactionPopupProps) {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	// make it so that income opens immediately
	const [tab, setTab] = useState<'income' | 'expense'>('income');
	const [amount, setAmount] = useState<number>(0);
	const [type, setType] = useState<string>('');
	const [notes, setNotes] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState<string>('');
	const [error, setError] = useState('');

	const handleSubmit = async () => {
		setError('');
		// request body
		const body = {
			name,
			amount,
			type,
			EconomyType: tab === 'income' ? 'Source' : 'Sink',
			notes,
		};

		try {
			setLoading(true);
			const res = await fetch(`${apiUrl}/api/dashboard/addTransaction`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify(body),
			});

			const newTransaction = await res.json();
			setLoading(false);

			if (!res.ok) {
				// make sure the error always sends some kind of message
				setError(newTransaction.error || 'Failed to add transaction');
				return;
			}

			onSubmit?.(newTransaction);
			onOpenChange(false);
		} catch (err) {
			console.error(err);
			setError('Something went wrong. Please try again.');
			setLoading(false);
		}
	};

	// ensure that the form clears when you exit it
	useEffect(() => {
		if (!open) {
			setName('');
			setAmount(0);
			setType('');
			setNotes('');
			setError('');
		}
	}, [open, tab]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogOverlay className="backdrop-blur-xs" />
			<DialogContent className="sm:max-w-lg shadow-2xl  bg-gray-100  rounded-xl p-6 ">
				<DialogHeader>
					<DialogTitle>Add Transaction</DialogTitle>
					{/* <p className="text-sm text-gray-600 mt-1">
            Set the details of the transaction
          </p> */}
					{/* annoying warning without it i think it looks the same but if you think the other one is better you can just switch it back */}
					<DialogDescription>
						Set the details of the transaction
					</DialogDescription>
				</DialogHeader>

				<Tabs
					value={tab}
					onValueChange={(val) => setTab(val as 'income' | 'expense')}
				>
					{/* Tabs */}
					<TabsList className="grid grid-cols-2 w-full mb-4 bg-gray-200 rounded-lg p-1">
						<TabsTrigger
							value="income"
							className="rounded-md hover:bg-gray-300 data-[state=active]:bg-white data-[state=active]:shadow"
						>
							Income
						</TabsTrigger>
						<TabsTrigger
							value="expense"
							className="rounded-md hover:bg-gray-300 data-[state=active]:bg-white data-[state=active]:shadow"
						>
							Expense
						</TabsTrigger>
					</TabsList>

					{/* Income Form */}
					<TabsContent value="income" className="space-y-4">
						<Input
							placeholder="Transaction Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full"
							// matches the db
							maxLength={25}
						/>

						<AmountInput
							value={amount}
							onChange={setAmount}
							className="w-full"
						/>

						<Select onValueChange={setType}>
							<SelectTrigger className="w-full hover:ring-1 hover:ring-gray-300 focus:ring-2 focus:ring-blue-400">
								<SelectValue placeholder="Income type" />
							</SelectTrigger>
							<SelectContent className="max-h-100 overflow-y-auto">
								{incomeCategories.map((i) => (
									<SelectItem
										key={i.type}
										value={i.type}
										className="cursor-pointer data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900"
									>
										{i.type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Input
							placeholder="Notes (Optional)"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className="w-full"
							// matches the db
							maxLength={65}
						/>

						{/* display the error messages right above the button */}
						{error && <p className="text-red-600 text-sm">{error}</p>}

						<Button
							className="w-full"
							onClick={handleSubmit}
							disabled={loading}
						>
							{loading ? 'Submitting...' : 'Add Income'}
						</Button>
					</TabsContent>
					{/* Expense Form */}
					<TabsContent value="expense" className="space-y-4">
						<Input
							placeholder="Transaction Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full"
							// matches the db
							maxLength={25}
						/>

						<AmountInput
							value={amount}
							onChange={setAmount}
							className="w-full"
						/>

						<Select onValueChange={setType}>
							<SelectTrigger className="w-full hover:ring-1 hover:ring-gray-300 focus:ring-2 focus:ring-blue-400">
								<SelectValue placeholder="Expense type" />
							</SelectTrigger>
							<SelectContent className="max-h-100 overflow-y-auto">
								{expenseCategories.map((e) => (
									<SelectItem
										key={e.type}
										value={e.type}
										className="cursor-pointer data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900"
									>
										{e.type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Input
							placeholder="Notes (Optional)"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className="w-full"
							// matches the db
							maxLength={65}
						/>

						{/* display the error messages right above the button */}
						{error && <p className="text-red-600 text-sm">{error}</p>}

						<Button
							className="w-full"
							onClick={handleSubmit}
							disabled={loading}
						>
							{loading ? 'Submitting...' : 'Add Expense'}
						</Button>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
