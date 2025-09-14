'use client';

import { Button } from '@/components/ui/button';
import { Transaction } from './transaction_row';

interface TransactionHeaderProps {
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function TransactionHeader({ setTransactions }: TransactionHeaderProps) {
  // creating new transaction here in a min

  //info

  const onClick = async () => {
    const results = await fetch(`${apiUrl}/api/dashboard/addTransaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: 'Test Transaction',
        amount: 100,
        type: 'Check',
        EconomyType: 'Source',
        notes: 'This is a test transaction',
      }),
    });

    const data = await results.json();

    if (setTransactions) {
      setTransactions(data.transactions);
    }
  };

  return (
    <div className="m-2 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Current</p>
        <h2 className="text-lg font-bold">Recorded Transactions</h2>
      </div>

      {/* search bar will go here */}

      <Button variant="default" size="lg" className="px-3" onClick={onClick}>
        Add Transaction
      </Button>
    </div>
  );
}
