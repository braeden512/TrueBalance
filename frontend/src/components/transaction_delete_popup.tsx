'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertDialogTitle,
} from './ui/alert-dialog';

interface TransactionDeletePopUpProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	transactionName?: string;
	isDeleting?: boolean;
}

export function TransactionDeletePopUp({
	open,
	onOpenChange,
	onConfirm,
	transactionName,
	isDeleting = false,
}: TransactionDeletePopUpProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogOverlay className="backdrop-blur-xs" />
			<AlertDialogContent className="sm:max-w-lg shadow-2xl  bg-gray-100  rounded-xl p-6 ">
				<AlertDialogHeader>
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
							<AlertTriangle className="h-5 w-5 text-red-600" />
						</div>
						<AlertDialogTitle>Delete Transaction?</AlertDialogTitle>
					</div>
					<AlertDialogDescription className="pt-3">
						Are you sure you want to delete{' '}
						{transactionName ? (
							<span className="font-semibold">
								&quot;{transactionName}&quot;
							</span>
						) : (
							'this transaction'
						)}
						? This action cannot be undone and will permanently remove this
						transaction from your records.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className=" ">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isDeleting}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isDeleting}
					>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
