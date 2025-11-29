// changed this to be all time instead of last 30 days

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
import { formatCurrency } from '@/utils/formatCurrency';
import { Transaction } from './transaction_row';

interface PredictionData {
	predict_x_epoch?: number;
	predict_y_net_saving?: number;
	regression?: {
		slope: number;
		intercept: number;
	};
}

interface ChartPoint {
	date: number;
	total: number;
	dataType: 'Historical' | 'Prediction';
}

interface LineRowProps {
	transactions: Transaction[];
	prediction?: PredictionData | null;
}

const formatDateLabel = (tick: number) => {
	const d = new Date(tick);
	return `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`;
};

export function LineRow({ transactions, prediction }: LineRowProps) {
	if (!transactions?.length) {
		return (
			<Card className="p-6 text-center text-gray-500">
				No transactions found
			</Card>
		);
	}

	let runningTotal = 0;
	const historicalData: ChartPoint[] = [...transactions]
		.sort(
			(a, b) =>
				new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
		)
		.map((t) => {
			const amount = Number(t.amount);
			runningTotal += t.EconomyType === 'Source' ? amount : -amount;
			return {
				date: new Date(t.created_at).getTime(),
				total: runningTotal,
				dataType: 'Historical',
			};
		});

	const combinedData = [...historicalData];
	let predictedSegment: ChartPoint[] = [];

	if (
		prediction?.predict_x_epoch &&
		prediction?.predict_y_net_saving !== undefined
	) {
		const lastPoint = historicalData[historicalData.length - 1];
		const predictionPoint: ChartPoint = {
			date: prediction.predict_x_epoch,
			total: prediction.predict_y_net_saving,
			dataType: 'Prediction',
		};
		combinedData.push(predictionPoint);
		predictedSegment = [lastPoint, predictionPoint];
	}

	interface TooltipProps {
		active?: boolean;
		payload?: Array<{
			value: number;
			payload: ChartPoint;
		}>;
		label?: number;
	}

	const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
		if (active && payload?.length) {
			const dataType = payload[0].payload.dataType;
			return (
				<div className="bg-white border rounded p-2 shadow text-sm">
					<p className="font-medium">{formatDateLabel(label!)}</p>
					<p className="text-blue-600">{formatCurrency(payload[0].value)}</p>
					{dataType === 'Prediction' && (
						<p className="text-xs text-green-600 mt-1">Predicted</p>
					)}
				</div>
			);
		}
		return null;
	};

	// Custom dot for prediction point
	const PredictionDot = (props: any) => {
		const { cx, cy, payload } = props;
		if (payload.dataType === 'Prediction') {
			return (
				<g>
					<circle
						cx={cx}
						cy={cy}
						r={6}
						fill="#22c55e"
						stroke="#fff"
						strokeWidth={2}
					/>
					<circle cx={cx} cy={cy} r={3} fill="#fff" />
				</g>
			);
		}
		return null;
	};

	return (
		<Card className="p-6 m-2 h-[400px]">
			<ResponsiveContainer width="100%" height="100%">
				<LineChart data={combinedData}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
					<XAxis
						dataKey="date"
						type="number"
						domain={['dataMin', 'dataMax']}
						tickFormatter={formatDateLabel}
						tick={{ fontSize: 12 }}
						stroke="#9ca3af"
					/>
					<YAxis
						tickFormatter={formatCurrency}
						tick={{ fontSize: 12 }}
						stroke="#9ca3af"
						width={80}
					/>
					<Tooltip content={<CustomTooltip />} />

					<Line
						type="monotone"
						dataKey="total"
						data={historicalData}
						stroke="#2563eb"
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 4 }}
						name="Net Saving"
					/>

					{predictedSegment.length > 0 && (
						<Line
							type="monotone"
							dataKey="total"
							data={predictedSegment}
							stroke="#22c55e"
							strokeWidth={2}
							strokeDasharray="5 5"
							dot={<PredictionDot />}
							activeDot={{ r: 6 }}
							isAnimationActive={false}
							name="Predicted"
						/>
					)}
				</LineChart>
			</ResponsiveContainer>
		</Card>
	);
}
