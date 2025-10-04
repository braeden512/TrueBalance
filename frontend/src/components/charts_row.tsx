import { PieChart, Award } from 'lucide-react';
import { DashboardCell } from './dashboard_cell';
import { ChartCell } from './chart_cell';
import { Transaction } from './transaction_row';

interface TransactionRowProps {
  transactions: Transaction[];
}

export function ChartsRow({ transactions }: TransactionRowProps) {
  // separate transactions into incomes and expense
  const incomeTransactions = transactions.filter(
    (transaction) => transaction.EconomyType == 'Source'
  );
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.EconomyType == 'Sink'
  );

  // aggregate transaction by type
  const aggregateTransactionsByType = (transactionsList: Transaction[]) => {
    const totalsByType: Record<string, number> = {};

    for (const transaction of transactionsList) {
      const transactionType = transaction.type;
      const transactionAmount = Number(transaction.amount);

      if (totalsByType[transactionType] == undefined) {
        totalsByType[transactionType] = 0; // initialize if not seen yet
      }

      totalsByType[transactionType] =
        totalsByType[transactionType] + transactionAmount;
    }

    // convert the totals object into an array of {type, amount}
    const aggregatedTransactions: { type: string; amount: number }[] = [];
    for (const type in totalsByType) {
      if (totalsByType.hasOwnProperty(type)) {
        aggregatedTransactions.push({ type: type, amount: totalsByType[type] });
      }
    }

    return aggregatedTransactions;
  };

  const aggregatedIncomes = aggregateTransactionsByType(incomeTransactions);
  const aggregatedExpenses = aggregateTransactionsByType(expenseTransactions);

  // find the transaction type with the highest amount
  const findLargestTransaction = (
    aggregatedTransactions: { type: string; amount: number }[]
  ) => {
    let largestTransaction = { type: '', amount: 0 };

    for (const transaction of aggregatedTransactions) {
      if (transaction.amount > largestTransaction.amount) {
        largestTransaction = transaction;
      }
    }
    return largestTransaction;
  };

  const largestIncomeTransaction = findLargestTransaction(aggregatedIncomes);
  const largestExpenseTransaction = findLargestTransaction(aggregatedExpenses);

  // calculate total income and expenses
  let totalIncomeAmount = 0;
  for (const transaction of aggregatedIncomes) {
    totalIncomeAmount = totalIncomeAmount + transaction.amount;
  }

  let totalExpenseAmount = 0;
  for (const transaction of aggregatedExpenses) {
    totalExpenseAmount = totalExpenseAmount + transaction.amount;
  }

  // calculate percentage of the largest transaction relative to the total
  let largestIncomePercentage: string;
  if (totalIncomeAmount > 0) {
    largestIncomePercentage =
      ((largestIncomeTransaction.amount / totalIncomeAmount) * 100).toFixed(1) +
      '%';
  } else {
    largestIncomePercentage = 'N/A';
  }

  let largestExpensePercentage: string;
  if (totalExpenseAmount > 0) {
    largestExpensePercentage =
      ((largestExpenseTransaction.amount / totalExpenseAmount) * 100).toFixed(
        1
      ) + '%';
  } else {
    largestExpensePercentage = 'N/A';
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 m-2">
        <ChartCell title="Types of Income" data={aggregatedIncomes} />
        <ChartCell title="Types of Expenses" data={aggregatedExpenses} />
        <div className="flex flex-col gap-4">
          <DashboardCell
            icon={<PieChart size={28} />}
            number={largestExpensePercentage}
            label={
              largestExpenseTransaction.type
                ? `Biggest Expense - ${largestExpenseTransaction.type}`
                : // made a small fix here to correct the label
                  'No expenses found.'
            }
          />
          <DashboardCell
            icon={<Award size={28} />}
            number={largestIncomePercentage}
            label={
              largestIncomeTransaction.type
                ? `Biggest Income - ${largestIncomeTransaction.type}`
                : // made a small fix here to correct the label
                  'No incomes found.'
            }
          />
        </div>
      </div>
    </div>
  );
}
