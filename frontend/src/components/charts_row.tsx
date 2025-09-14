import { PieChart, Award } from 'lucide-react';
import { DashboardCell } from './dashboard_cell';
import { ChartCell } from './chart_cell';
import { Transaction } from './transaction_row';

// rough draft of what I think the expenses list and the incomes list might look like
const expenses = [
  { amount: 1, type: 'Rent' },
  { amount: 1, type: 'Mortgage' },
  { amount: 1, type: 'Utility Bills' },
  { amount: 1, type: 'Insurance Bills' },
  { amount: 1, type: 'Loan Payments' },
  { amount: 1, type: 'Subscriptions' },
  { amount: 1, type: 'Groceries' },
  { amount: 1, type: 'Gas and Transportation' },
  { amount: 1, type: 'Consumer Goods' },
  { amount: 1, type: 'Dining Out' },
  { amount: 1, type: 'Entertainment' },
  { amount: 1, type: 'Clothing' },
  { amount: 1, type: 'Car Maintenance' },
  { amount: 1, type: 'Medical Expenses' },
  { amount: 1, type: 'Vacations' },
  { amount: 1, type: 'Gifts and Donations' },
  { amount: 1, type: 'Home Repairs and Remodels' },
  { amount: 1, type: 'Lottery or Gambling Losses' },
  { amount: 1, type: 'Other' },
];
const incomes = [
  { amount: 1, type: 'Salary and Wages' },
  { amount: 1, type: 'Bonuses and Commissions' },
  { amount: 1, type: 'Freelance and Consulting Fees' },
  { amount: 1, type: 'Tips and Gratuities' },
  { amount: 1, type: 'Rental Income' },
  { amount: 1, type: 'Capital Gains and Investments' },
  { amount: 1, type: 'Gifts' },
  { amount: 1, type: 'Inheritance' },
  { amount: 1, type: 'Tax Refunds' },
  { amount: 1, type: 'Grants or Scholarships' },
  { amount: 1, type: 'Lottery or Gambling Winnings' },
  { amount: 1, type: 'Other' },
];

interface TransactionRowProps {
  transactions: Transaction[];
}

export function ChartsRow({ transactions }: TransactionRowProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 m-2">
        <ChartCell title="Types of Income" data={incomes} />
        <ChartCell title="Types of Expenses" data={expenses} />
        <div className="flex flex-col gap-4">
          {/* gonna have to actually calculate these out somewhere and import them through these fields */}
          <DashboardCell
            icon={<PieChart size={28} />}
            number="37.2%"
            label="Biggest Expense - Gas and Transportation"
          />
          <DashboardCell
            icon={<Award size={28} />}
            number="82.5%"
            label="Biggest Income - Salary and Wages"
          />
        </div>
      </div>
    </div>
  );
}
