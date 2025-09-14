import { DollarSign, Minus, PiggyBank, Plus, TrendingUp } from 'lucide-react';
import { DashboardCell } from './dashboard_cell';
import { Transaction } from './transaction_row';

interface TransactionRowProps {
  transactions: Transaction[];
}
export function StatsRow({ transactions }: TransactionRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 m-2">
      <DashboardCell
        icon={<Plus size={28} />}
        number="$475.23"
        label="Income This Month"
      />
      <DashboardCell
        icon={<Minus size={28} />}
        number="$475.23"
        label="Expenses This Month"
      />
      {/* overall income - expenses */}
      <DashboardCell
        icon={<DollarSign size={28} />}
        number="$999.99"
        label="Total Dollar Amount"
      />
      {/* just the income - expenses for the month */}
      <DashboardCell
        icon={<PiggyBank size={28} />}
        number="$1,502.03"
        label="Net Savings This Month"
      />
      {/* not sure exactly how this will work yet */}
      <DashboardCell
        icon={<TrendingUp size={28} />}
        number="23.2%"
        label="Change From Last Month"
      />
    </div>
  );
}
