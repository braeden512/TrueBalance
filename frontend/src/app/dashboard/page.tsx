'use client';

import AuthWrapper from '@/components/AuthWrapper';
import { StatsRow } from '@/components/stats_row';
import { Transaction, TransactionRow } from '@/components/transaction_row';
import { ChartsRow } from '@/components/charts_row';
import { TransactionHeader } from '@/components/transaction_header';
import { useEffect, useState } from 'react';
import { LineRow } from '@/components/line_row';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const initialFetch = async () => {
      const results = await fetch(`${apiUrl}/api/dashboard/getTransactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await results.json();
      setTransactions(data.transactions);

      //gets ran twice for some reason
      // i looked it up... its bc of react strict mode (it wont be like this in production)
      console.log(data);
    };

    initialFetch();
  }, []);

  return (
    // authwrapper ensures that they have to be logged in to see it
    <AuthWrapper>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/background_pattern.png')" }}
      >
        {/* adds x-axis padding */}
        <div className="px-4 md:px-6 lg:px-40">
          <StatsRow transactions={transactions} />

          {/* header for transaction row */}
          <TransactionHeader setTransactions={setTransactions} />

          <TransactionRow transactions={transactions} />

          {/* header for charts row */}
          <div className="m-2">
            <p className="text-sm text-muted-foreground">Monthly</p>
            <h2 className="text-lg font-bold">Statistics and Graphs</h2>
          </div>

          <ChartsRow transactions={transactions} />

          {/* header for charts row */}
          <div className="m-2">
            <p className="text-sm text-muted-foreground">All</p>
            <h2 className="text-lg font-bold">Transactions Over Time</h2>
          </div>
          <LineRow transactions={transactions} />
        </div>
      </div>
    </AuthWrapper>
  );
}
