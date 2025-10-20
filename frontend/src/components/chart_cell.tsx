'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatCurrency';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// this is the format that we import in the data from the database with
interface ExpenseData {
	amount: number;
	type: string;
}

// these are the fields for chart cells
interface ChartCellProps {
	title: string;
	data: ExpenseData[];
}

const COLORS = [
	'#8884d8',
	'#82ca9d',
	'#ffc658',
	'#ff7f50',
	'#a4de6c',
	'#d0ed57',
];

export function ChartCell({ title, data }: ChartCellProps) {
	// check if data is not empty
	const hasData = data && data.length > 0;

	return (
		<Card className="flex flex-col col-span-2">
			<CardHeader className="text-center font-semibold">{title}</CardHeader>
			<CardContent className="flex-1 flex items-center justify-center">
				{hasData ? (
					<ResponsiveContainer width="100%" height={200}>
						<PieChart>
							<Pie
								data={data}
								dataKey="amount"
								nameKey="type"
								cx="50%"
								cy="50%"
								innerRadius={65}
								outerRadius={100}
								paddingAngle={2}
							>
								{data.map((_, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip
								formatter={(value: number) => formatCurrency(Number(value))}
								labelFormatter={() => ''}
							/>
						</PieChart>
					</ResponsiveContainer>
				) : (
					<div className="w-full h-[200px] flex items-center justify-center text-gray-500">
						No transactions found.
					</div>
				)}
			</CardContent>
		</Card>
	);
}
