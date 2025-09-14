import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from './ui/card';
import { formatDate } from '@/utils/formatDate';

// format used to import the transactions from a particular user
export interface Transaction {
  id: number;
  name: string;
  amount: number;
  EconomyType: 'Source' | 'Sink';
  type: string;
  notes: string;
  created_at: string;
}

interface TransactionRowProps {
  transactions: Transaction[];
}

const getStyleColor = (type: 'Source' | 'Sink') => ({
  // was backwards... should be good now
  color: type === 'Source' ? 'limegreen' : 'red',
});
const getSign = (type: 'Source' | 'Sink') => (type === 'Source' ? '+' : '-');

export function TransactionRow({ transactions }: TransactionRowProps) {
  return (
    <div>
      <div className="m-2">
        <Card className="p-5">
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">
                    Date of Transaction
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <TableRow key={transaction.id}>
                      {/* transaction.id is an easy way for us to identify what transaction it is from ANY user*/}
                      {/* for example, if two users both make a new transaction, the transaction.id from the second user would say... */}
                      {/* 2, even though that user hadn't created a transaction yet. this is why we shouldn't use transaction.id for the line below too*/}
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{transaction.name}</TableCell>
                      <TableCell style={getStyleColor(transaction.EconomyType)}>
                        {getSign(transaction.EconomyType)}${transaction.amount}
                      </TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.notes}</TableCell>
                      <TableCell className="text-right">
                        {/* look in utils folder to find this file (just formats the date correctly) */}
                        {formatDate(transaction.created_at)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center pt-6">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
