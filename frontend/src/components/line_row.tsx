import { Transaction } from './transaction_row';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Card } from './ui/card';

// format date as M/D/YY
function formatDateLabel(tick: number) {
  const dateObj = new Date(tick);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const year = String(dateObj.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}

interface LineRowProps {
  transactions: Transaction[];
}

export function LineRow({ transactions }: LineRowProps) {
  // filter transactions to only include the last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentTransactions = transactions.filter(
    (t) => new Date(t.created_at) >= thirtyDaysAgo
  );

  // sort transactions oldest to newest
  const sortedTransactions = [...recentTransactions].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // compute running total (adds for sources, subtracts for sinks)
  let runningTotal = 0;
  const chartData = sortedTransactions.map((t) => {
    const amount = Number(t.amount);
    runningTotal += t.EconomyType === 'Source' ? amount : -amount;
    return {
      date: new Date(t.created_at).getTime(), // for x-axis spacing
      total: runningTotal,
      type: t.EconomyType,
    };
  });

  return (
    <div className="grid m-2">
      <Card className="flex flex-col col-span-2 p-12 h-120">
        <div className="flex-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                type="number"
                domain={['auto', 'auto']}
                tickFormatter={formatDateLabel}
                tick={{ fontSize: 12 }}
                label={{
                  value: 'Date',
                  position: 'insideBottom',
                  offset: -5,
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(label) => `Date: ${formatDateLabel(label)}`}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={2.5}
                activeDot={{ r: 6 }}
                name="Running Total"
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
