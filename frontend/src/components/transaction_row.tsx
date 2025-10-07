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
import { formatCurrency } from '@/utils/formatCurrency';

// delete and edit button
import { Button } from './ui/button';
import { Trash } from 'lucide-react';
import { Pencil } from 'lucide-react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

  // update parent state after successful deletion
  onDeleteSuccess : (deletedTransactionId: number) => void;
}



const getStyleColor = (type: 'Source' | 'Sink') => ({
  // was backwards... should be good now
  color: type === 'Source' ? 'limegreen' : 'red',
});
const getSign = (type: 'Source' | 'Sink') => (type === 'Source' ? '+' : '-');

export function TransactionRow({ transactions, onDeleteSuccess}: TransactionRowProps) {

  // confirmation before deletion
  const handleDelete = async (transactionId:number) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const res = await fetch (
        `${apiUrl}/api/dashboard/deleteTransaction/${transactionId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );
      
      // success
      if (res.status === 204) {
        onDeleteSuccess(transactionId);
      } else {
        const errorData = await res.json();
        console.error('Failed to delete transaction', errorData.error);
        alert(`Failed to delete transaction: ${errorData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Unexpected error occurred during deletion');
    }
  };

  return (
    <div>
      <div className="m-2">
        <Card className="p-5">
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader className="w-full border-b bg-white shadow-sm">
                <TableRow>
                  <TableHead className="w-[70px]">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">
                    Date of Transaction
                  </TableHead>
                  <TableHead>Actions</TableHead>
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
                        {getSign(transaction.EconomyType)}
                        {formatCurrency(Number(transaction.amount))}
                      </TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.notes}</TableCell>
                      <TableCell className="text-right">
                        {/* look in utils folder to find this file (just formats the date correctly) */}
                        {formatDate(transaction.created_at)}
                      </TableCell>

                      <TableCell className='space-x-2'>
                        <Button
                          variant={'ghost'}
                        >
                          <Pencil></Pencil>

                        </Button>
                        <Button
                          variant={'ghost'}
                          onClick={() => handleDelete(transaction.id)}
                          className='hover:bg-red-100'
                        >
                          <Trash className='text-red-500'></Trash>
                        </Button>                        
                      </TableCell>

                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center pt-6 text-gray-500"
                    >
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
