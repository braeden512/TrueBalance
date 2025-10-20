'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, InfoIcon, AlertCircle } from 'lucide-react';
import { format, startOfToday, startOfTomorrow } from 'date-fns';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Transaction } from './transaction_row';

interface LineHeaderProps {
	onDateChange?: (date: Date | undefined) => void;
	transactions: Transaction[];
}

export function LineHeader({ onDateChange, transactions }: LineHeaderProps) {
	const [date, setDate] = useState<Date | undefined>(undefined);

	// check if we have enough data for predictions
	const hasMinimumTransactions = transactions.length >= 5;

	const hasTimeSpread =
		transactions.length >= 2 &&
		(() => {
			const dates = transactions.map((t) => new Date(t.created_at).getTime());
			const minDate = Math.min(...dates);
			const maxDate = Math.max(...dates);
			const daysDiff = (maxDate - minDate) / (1000 * 60 * 60 * 24);
			return daysDiff >= 7;
		})();

	const canPredict = hasMinimumTransactions && hasTimeSpread;

	// get message for why predictions aren't available
	const getInsufficientDataMessage = () => {
		if (!hasMinimumTransactions) {
			return `Add ${5 - transactions.length} more transaction${5 - transactions.length === 1 ? '' : 's'} to enable predictions.`;
		}
		if (!hasTimeSpread) {
			return 'Add transactions over at least 7 days to enable predictions.';
		}
		return '';
	};

	const handleDateSelect = (selected: Date | undefined) => {
		setDate(selected);
		onDateChange?.(selected);
	};

	return (
		<div className="m-2">
			<div className="flex items-center justify-between mb-2">
				<div>
					<div className="flex items-center gap-2">
						<h2 className="text-lg font-bold">Transactions Over Time</h2>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<InfoIcon className="h-4 w-4 text-muted-foreground cursor-pointer" />
								</TooltipTrigger>
								<TooltipContent side="right" className="max-w-xs text-sm">
									Predictions are more accurate with more transaction data and
									may not be exact.
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					<p className="text-sm text-muted-foreground">
						{canPredict
							? 'Select a future date to predict your savings.'
							: 'Add more transaction data to enable predictions.'}
					</p>
				</div>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="flex items-center gap-2"
							disabled={!canPredict}
						>
							<CalendarIcon className="h-4 w-4" />
							{date ? format(date, 'MMM d, yyyy') : 'Select date'}
						</Button>
					</PopoverTrigger>

					<PopoverContent className="w-auto p-0" align="end">
						<Calendar
							mode="single"
							selected={date}
							onSelect={handleDateSelect}
							defaultMonth={new Date()}
							disabled={{ before: startOfTomorrow() }}
						/>
					</PopoverContent>
				</Popover>
			</div>

			{!canPredict && transactions.length > 0 && (
				<Alert className="mt-2">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{getInsufficientDataMessage()}</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
