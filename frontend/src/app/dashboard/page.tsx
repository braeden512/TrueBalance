"use client";

import {Card, CardContent, CardDescription, CardHeader,
} from "@/components/ui/card"

import { Car, Plus } from 'lucide-react';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import AuthWrapper from "@/components/AuthWrapper";


export default function DashboardPage() {
  // mock data (later would be replaced with real fetched data)
  const expenses = [
    {name: "Electricity Bill", amount: 361.29, type: "Recurring Bill"},
    {name: "Gas", amount: 35.00, type: "Transportation"}
  ]

  const incomes = [
    {name: "Work Deposit", amount: 1831.29, type: "Income check"},
    {name: "Gift", amount: 30.00, type: "Other"}
  ]

  // get the total
  const totalExpenses = expenses.reduce((totalAmount, expense) => totalAmount + expense.amount, 0);
  const totalIncomes = incomes.reduce((totalAmount, income) => totalAmount + income.amount, 0);

  // get the percentage
  const expensePercentage = expenses.map((expense) => ({
    name: expense.name,
    percentage: ((expense.amount / totalExpenses) * 100).toFixed(1)
  }));

  const incomePercentage = expenses.map((income) => ({
    name: income.name,
    percentage: ((income.amount / totalIncomes) * 100).toFixed(1)
  }));

  // list of 10 colors
  const COLORS = ['red', 'green', 'yellow', 'orange', 'blue', 'purple', 'pink', 'black', 'brown', 'gray'];


  return (

    // authwrapper ensures that they have to be logged in to see it
    <AuthWrapper>
      {/* see pie chart side by side */}
      <div className="flex">

          <div className="w-full h-80">
          <p>Pie Chart by Expense Type</p>
          {/* pie chart for expense */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={800} height={400}>
              <Pie
                data={expenses}
                isAnimationActive={true}
                cx={120}
                cy={200}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="amount"
                nameKey="name"
              >
                {expenses.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip/>
            </PieChart>
            </ResponsiveContainer>
          </div>

        <div className="w-full h-80">
        <p>Pie Chart by Income Type</p>
          {/* pie chart for income */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={800} height={400}>
              <Pie
                data={incomes}
                isAnimationActive={true}
                cx={120}
                cy={200}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="amount"
                nameKey="name"
              >
                {expenses.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip/>
            </PieChart>
            </ResponsiveContainer>
          </div>
      </div>

              
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Summary cards for expense percentage */}
        {expensePercentage.map((expense) => (
            <Card key={expense.name}>
              <CardHeader>
                  <Plus />
                  <CardDescription>{expense.percentage}%</CardDescription>
              </CardHeader>

              <CardContent>
                  <p>{expense.name}</p>
              </CardContent>
            </Card>
            ))}

          {/* Summary cards for income percentage */}
          {incomePercentage.map((income) => (
            <Card key={income.name}>
              <CardHeader>
                  <Plus />
                  <CardDescription>{income.percentage}%</CardDescription>
              </CardHeader>

              <CardContent>
                  <p>{income.name}</p>
              </CardContent>
            </Card>
            ))}
        </div>
      </div> 
    </AuthWrapper>
  );
}