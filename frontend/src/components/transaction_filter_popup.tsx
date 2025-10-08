'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/ui/dialog';

interface TransactionFilterPopUpProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TransactionFilterPopUp({
	open,
	onOpenChange,
}: TransactionFilterPopUpProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogTitle>Filter Transactions</DialogTitle>
				<DialogDescription>
					Lorem ipsum dolor sit amet. 33 dolorem labore sit repellat itaque vel
					quis quae aut expedita aspernatur ad quam tenetur aut perspiciatis
					laudantium qui quidem sunt. Eos magni numquam id praesentium
					repellendus in fugiat necessitatibus ea unde laboriosam qui
					perferendis nostrum non voluptatum unde. Et deleniti cumque aut
					asperiores tempora aut voluptate impedit ex error sequi.
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}
