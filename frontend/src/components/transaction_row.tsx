import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "./ui/card"

// format used to import the transactions from a particular user
export interface Transaction {
    id: number;
    name: string;
    amount: number;
    type: string;
    notes: string;
    date: string;
}

interface TransactionRowProps {
  transactions: Transaction[];
}

export function TransactionRow({ transactions }: TransactionRowProps) {
    return (
        <div>
            <div className="m-2">
                <Card className="p-5">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[70px]">#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead className="text-right">Date of Transaction</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* loop through each transaction and list them */}
                            {transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{transaction.name}</TableCell>
                                    <TableCell>${transaction.amount}</TableCell>
                                    <TableCell>{transaction.type}</TableCell>
                                    <TableCell>{transaction.notes}</TableCell>
                                    <TableCell className="text-right">{transaction.date}</TableCell>
                                </TableRow>
                                ))
                            // if no transactions exist
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center pt-6">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    )
}