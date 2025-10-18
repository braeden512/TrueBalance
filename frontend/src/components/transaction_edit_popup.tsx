'use client';

import expenses from '../data/expenses.json';
import incomes from '../data/incomes.json';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogOverlay,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { AmountInput } from './ui/amount-input';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectValue,
	SelectItem,
} from './ui/select';
import { Transaction, transactionBody } from './transaction_row';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { Spinner } from './ui/spinner';

interface type {
	type: string;
}

interface infoType {
	open: boolean;
	transaction: Transaction | undefined;
}

interface TransactionEditPopUpProps {
	data: infoType;
	closeFunction: () => void;
	handleEdit: (editedTransaction: transactionBody) => Promise<void>;
}

const expenseCategories: type[] = expenses as type[];
const incomeCategories: type[] = incomes as type[];

export function TransactionEditPopUp({
	data,
	closeFunction,
	handleEdit,
}: TransactionEditPopUpProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [tab, setTab] = useState<'income' | 'expense'>(
		data.transaction?.EconomyType === 'Sink' ? 'expense' : 'income'
	);
	const [amount, setAmount] = useState<number>(() => {
		//edgecase
		const amt = data.transaction?.amount as number | string | undefined;
		return amt == undefined ? 0 : typeof amt === 'string' ? Number(amt) : amt;
	});
	const [type, setType] = useState<string>(data.transaction?.type || '');
	const [notes, setNotes] = useState<string>(data.transaction?.notes || '');
	const [name, setName] = useState<string>(data.transaction?.name || '');

	useEffect(() => {
		if (data.transaction) {
			//edge case
			const amt = data.transaction.amount as number | string;

			setTab(data.transaction.EconomyType === 'Sink' ? 'expense' : 'income');
			setAmount(typeof amt === 'string' ? Number(amt) : amt);
			setType(data.transaction.type);
			setNotes(data.transaction.notes);
			setName(data.transaction.name);
			return;
		}

		setName('');
		setAmount(0);
		setType('');
		setNotes('');
		setError('');
	}, [data]);

	const handleSubmit = async () => {
		setError('');
		setLoading(true);
		const body = {
			name,
			amount,
			type,
			EconomyType: (tab === 'income' ? 'Source' : 'Sink') as 'Source' | 'Sink',
			notes,
		};

		handleEdit(body)
			.then(() => closeFunction())
			.catch((er) => {
				setError(er);
				console.error(er);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<Dialog open={data.open} onOpenChange={closeFunction}>
			<DialogOverlay className="backdrop-blur-xs" />
			<DialogContent className="sm:max-w-lg shadow-2xl  bg-gray-100  rounded-xl p-6 ">
				<DialogTitle>Edit Transaction</DialogTitle>
				<DialogDescription className="-mt-1 mb-1 ">
					Edit the details of the transaction
				</DialogDescription>

				<Tabs
					value={tab}
					onValueChange={(val) => {
						setType('');
						setTab(val as 'income' | 'expense');
					}}
				>
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
							value={amount} //placeholder
							onChange={setAmount}
							className="w-full"
						/>

						<Select onValueChange={setType}>
							<SelectTrigger className="w-full hover:ring-1 hover:ring-gray-300 focus:ring-2 focus:ring-blue-400">
								<SelectValue placeholder={type} />
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
					</TabsContent>
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
								<SelectValue placeholder={type} />
								{/* <SelectItem value={type}>{type}</SelectItem> */}
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
							maxLength={65}
						/>
					</TabsContent>
					{error && <p className="text-red-600 text-sm">{error}</p>}
					<Button className="w-full" onClick={handleSubmit} disabled={loading}>
						{loading ? (
							<>
								<Spinner /> Submitting...
							</>
						) : (
							'Save Changes'
						)}
					</Button>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
