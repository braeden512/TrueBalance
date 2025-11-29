'use client';

import { useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from './ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

import { ListFilter } from 'lucide-react';

interface type {
	type: string;
}

import expenses from '../data/expenses.json';
import incomes from '../data/incomes.json';

const expenseCategories: type[] = expenses as type[];
const incomeCategories: type[] = incomes as type[];
const all = [...expenseCategories, ...incomeCategories];
const index = all.findIndex((obj) => obj.type === 'Other');
if (index !== -1) {
	all.splice(index, 1);
}

// interface TransactionFilterPopUpProps {
// 	open: boolean;
// 	onOpenChange: (open: boolean) => void;
// }

interface TransactionHeaderProps {
	handleFilterRule: (rule: string) => void;
}

export function TransactionFilterPopUp({
	handleFilterRule,
}: TransactionHeaderProps) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					size="icon"
					aria-expanded={open}
				>
					<ListFilter />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search Type..." className="h-9" />
					<CommandList>
						<CommandEmpty>No framework found.</CommandEmpty>
						<CommandGroup>
							{all.map((framework) => (
								<CommandItem
									key={framework.type}
									value={framework.type}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? '' : currentValue);
										setOpen(false);
										handleFilterRule(
											currentValue === value ? '' : currentValue
										);
									}}
								>
									{framework.type}
									<Check
										className={cn(
											'ml-auto',
											value === framework.type ? 'opacity-100' : 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
