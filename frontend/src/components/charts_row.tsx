import { PieChart, Award } from 'lucide-react';
import { DashboardCell } from './dashboard_cell';
import { ChartCell } from './chart_cell';
import { Transaction } from './transaction_row';

interface TransactionRowProps {
  transactions: Transaction[];
}

export function ChartsRow({ transactions }: TransactionRowProps) {
  // separate transactions into incomes and expense
  const incomeTransactions = transactions.filter(transction => transction.EconomyType == "Source");
  const expenseTransactions = transactions.filter(transction => transction.EconomyType == "Sink");

  // aggregate transaction by type
  const aggregateTransctionsByType = (transactionsList: Transaction[]) => {
    const totalsByType: Record<string, number> = {};

    for (const transction of transactionsList) {
      const transactionType = transction.type;
      const transctionAmount = Number(transction.amount);

      if (totalsByType[transactionType] == undefined) {
        totalsByType[transactionType] = 0; // initialize if not seen yet 
      }

      totalsByType[transactionType] = totalsByType[transactionType] + transctionAmount;
    }

    // convert the totals object into an array of {type, amount}
    const aggregatedTransactions: {type:string, amount:number} [] = [];
    for (const type in totalsByType) {
      if (totalsByType.hasOwnProperty(type)) {
        aggregatedTransactions.push({type:type, amount:totalsByType[type]});
      }
    }

    return aggregatedTransactions;
  };

  const aggregatedIncomes = aggregateTransctionsByType(incomeTransactions);
  const aggregatedExpenses = aggregateTransctionsByType(expenseTransactions);

  // find the transction type with the highest amount
  const findLargestTransaction = (aggregatedTransctions: {type:string; amount:number}[]) => {
    let largestTransaction = {type: "", amount:0};

    for (const transaction of aggregatedTransctions) {
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
    totalExpenseAmount = totalExpenseAmount + transaction.amount
  }

  // calculate percentage of the largest transaction relative to the total
  let largestIncomePercentage:string;
  if (totalIncomeAmount > 0) {
    largestIncomePercentage = ((largestIncomeTransaction.amount / totalIncomeAmount) * 100).toFixed(1) + "%";
  } else {
    largestIncomePercentage = "N/A";
  }

  let largestExpensePercentage:string;
  if (totalExpenseAmount > 0) {
    largestExpensePercentage = ((largestExpenseTransaction.amount / totalExpenseAmount) * 100).toFixed(1) + "%";
  } else {
    largestExpensePercentage = "N/A";
  }


  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 m-2">
        <ChartCell title="Types of Income" data={aggregatedIncomes} />
        <ChartCell title="Types of Expenses" data={aggregatedExpenses} />
        <div className="flex flex-col gap-4">
          {/* gonna have to actually calculate these out somewhere and import them through these fields */}
          <DashboardCell
            icon={<PieChart size={28} />}
            number={largestExpensePercentage}
            label={`Biggest Expense - ${largestExpenseTransaction.type}`}
          />
          <DashboardCell
            icon={<Award size={28} />}
            number={largestIncomePercentage}
            label={`Biggest Income - ${largestIncomeTransaction.type}`}
          />
        </div>
      </div>
    </div>
  );
}
