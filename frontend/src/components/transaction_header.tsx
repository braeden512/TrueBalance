'use client';

import { Button } from '@/components/ui/button';
import { Transaction } from './transaction_row';
import { TransactionPopup } from './transaction_popup';
import { useState } from 'react';

interface TransactionHeaderProps {
  setTransactions?: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export function TransactionHeader({ setTransactions }: TransactionHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="m-2 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Current</p>
        <h2 className="text-lg font-bold">Recorded Transactions</h2>
      </div>

      <Button
        variant="default"
        size="lg"
        className="px-3"
        onClick={() => setOpen(true)}
      >
        Add Transaction
      </Button>

      <TransactionPopup
        open={open}
        onOpenChange={setOpen}
        onSubmit={(newTransaction) => {
          if (setTransactions) {
            // put the newest transaction at the top
            setTransactions((prev) => [newTransaction, ...prev]);
          }
        }}
      />
    </div>
  );
}
