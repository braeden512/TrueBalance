"use client";

import AuthWrapper from "@/components/AuthWrapper";
import { StatsRow } from "@/components/stats_row";
import { TransactionRow } from "@/components/transaction_row";
import { ChartsRow } from "@/components/charts_row";
import { TransactionHeader } from "@/components/transaction_header";

// mock data (later would be replaced with real fetched data)
const transactionsData = [
  {
    id: 1,
    name: "Shell Gas",
    amount: 43.52,
    type: "Gas",
    notes: "Got some gas from a shell station",
    date: "9/10/2025"
  },
  {
    id: 2,
    name: "Amazon",
    amount: 29.99,
    type: "Shopping",
    notes: "Bought a book",
    date: "9/09/2025"
  },
  {
    id: 3,
    name: "Netflix",
    amount: 15.99,
    type: "Subscription",
    notes: "Monthly subscription",
    date: "9/05/2025"
  }
];


export default function DashboardPage() {
  return (

    // authwrapper ensures that they have to be logged in to see it
    <AuthWrapper>
      <div className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background_pattern.png')" }}>
        {/* adds x-axis padding */}
        <div className="px-4 md:px-6 lg:px-40">

          <StatsRow />

          {/* header for transaction row */}
          <TransactionHeader />
          <TransactionRow transactions={transactionsData}/>

          {/* header for charts row */}
          <div className="m-2">
              <p className="text-sm text-muted-foreground">Monthly</p>
              <h2 className="text-lg font-bold">Statistics and Graphs</h2>
          </div>
          <ChartsRow />


          {/* had an idea for a line graph we could add at the bottom, but not gonna implement yet */}
        </div>
      </div>
    </AuthWrapper>
  );
}