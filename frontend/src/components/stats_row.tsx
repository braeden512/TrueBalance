import { DollarSign, Minus, PiggyBank, Plus, TrendingUp } from 'lucide-react';
import { DashboardCell } from './dashboard_cell';
import { Transaction } from './transaction_row';
import { formatCurrency } from '@/utils/formatCurrency';

interface TransactionRowProps {
	transactions: Transaction[];
}
export function StatsRow({ transactions }: TransactionRowProps) {
	// define time periods dynamically
	const now = new Date(); // current month
	const currentEnd = new Date(now);
	const currentStart = new Date(now);
	currentStart.setDate(now.getDate() - 30);

	const lastEnd = new Date(currentStart); // last month
	const lastStart = new Date(currentStart);
	lastStart.setDate(currentStart.getDate() - 30);

	// initialize totals
	let incomeCurrent = 0;
	let expenseCurrent = 0;
	let incomeLast = 0;
	let expenseLast = 0;
	let incomeAllTime = 0;
	let expenseAllTime = 0;

	// loop through each transaction
	if (transactions !== undefined) {
		for (const transaction of transactions) {
			const amount = Number(transaction.amount);
			const transactionDate = new Date(transaction.created_at);

			// all time totals
			if (transaction.EconomyType == 'Source') {
				incomeAllTime += amount;
			} else if (transaction.EconomyType == 'Sink') {
				expenseAllTime += amount;
			}

			if (transactionDate >= currentStart && transactionDate <= currentEnd) {
				// includes currentStart and currentEnd
				if (transaction.EconomyType == 'Source') {
					incomeCurrent += amount;
				} else if (transaction.EconomyType == 'Sink') {
					expenseCurrent += amount;
				}
			} else if (transactionDate >= lastStart && transactionDate < lastEnd) {
				// includes lastStart, excludes lastEnd
				if (transaction.EconomyType == 'Source') {
					incomeLast += amount;
				} else if (transaction.EconomyType == 'Sink') {
					expenseLast += amount;
				}
			}
		}
	}

	// compute results
	const netCurrent = incomeCurrent - expenseCurrent;
	const netLast = incomeLast - expenseLast;

	const currentIncome = formatCurrency(incomeCurrent);
	const currentExpense = formatCurrency(expenseCurrent);
	const totalDollar = formatCurrency(incomeAllTime - expenseAllTime);
	const netSaving = formatCurrency(netCurrent);

	let change;
	if (netLast !== 0) {
		const percent = ((netCurrent - netLast) / Math.abs(netLast)) * 100;
		change = percent.toFixed(1) + '%';
	} else {
		change = 'N/A';
	}

	return (
		<div>
			{/* stats cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 m-2">
				<DashboardCell
					icon={<Plus size={28} />}
					number={currentIncome}
					label="Income This Month"
				/>
				<DashboardCell
					icon={<Minus size={28} />}
					number={currentExpense}
					label="Expenses This Month"
				/>
				{/* overall income - expenses */}
				<DashboardCell
					icon={<DollarSign size={28} />}
					number={totalDollar}
					label="Total Dollar Amount"
				/>
				{/* just the income - expenses for the month */}
				<DashboardCell
					icon={<PiggyBank size={28} />}
					number={netSaving}
					label="Net Savings This Month"
				/>
				{/* not sure exactly how this will work yet */}
				<DashboardCell
					icon={<TrendingUp size={28} />}
					number={change}
					label="Change From Last Month"
				/>
			</div>
		</div>
	);
}
