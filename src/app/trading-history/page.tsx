import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const tradingHistory = [
  {
    id: 1,
    date: '2024-11-11',
    tokenId: 'LUXY-001',
    type: 'Buy',
    amount: 100,
    price: 50,
    total: 5000,
  },
  {
    id: 2,
    date: '2024-11-30',
    tokenId: 'COMS-002',
    type: 'Buy',
    amount: 500,
    price: 100,
    total: 50000,
  },
  {
    id: 3,
    date: '2024-12-02',
    tokenId: 'BEACH-003',
    type: 'Buy',
    amount: 50,
    price: 100,
    total: 5000,
  },
  {
    id: 4,
    date: '2024-12-12',
    tokenId: 'LUXY-001',
    type: 'Sell',
    amount: 50,
    price: 55,
    total: 2750,
  },
  {
    id: 5,
    date: '2024-12-14',
    tokenId: 'TBW',
    type: 'Buy',
    amount: 10,
    price: 10,
    total: 100,
  },
];

export default function TradingHistoryPage() {
  return (
    <div className="container mx-auto min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-900">Trading History</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Token ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tradingHistory.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell>{trade.date}</TableCell>
              <TableCell>{trade.tokenId}</TableCell>
              <TableCell>
                <Badge variant={trade.type === 'Buy' ? 'secondary' : 'destructive'}>
                  {trade.type}
                </Badge>
              </TableCell>
              <TableCell>{trade.amount}</TableCell>
              <TableCell>${trade.price}</TableCell>
              <TableCell>${trade.total.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
