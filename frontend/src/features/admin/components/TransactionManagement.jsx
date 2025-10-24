import { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';

const TransactionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [transactions] = useState([
    {
      id: 'TXN001',
      userId: 'USR123',
      userName: 'Nguyen Van A',
      amount: 250000,
      type: 'purchase',
      status: 'pending',
      createdAt: '2024-03-15 10:30:00',
      description: 'Purchase of Honda Wave 2020'
    },
    {
      id: 'TXN002',
      userId: 'USR456',
      userName: 'Tran Thi B',
      amount: 150000,
      type: 'withdrawal',
      status: 'completed',
      createdAt: '2024-03-15 09:15:00',
      description: 'Withdrawal to bank account'
    },
    {
      id: 'TXN003',
      userId: 'USR789',
      userName: 'Le Van C',
      amount: 300000,
      type: 'purchase',
      status: 'verified',
      createdAt: '2024-03-14 16:45:00',
      description: 'Purchase of Yamaha Exciter 2021'
    },
    {
      id: 'TXN004',
      userId: 'USR321',
      userName: 'Pham Thi D',
      amount: 75000,
      type: 'refund',
      status: 'failed',
      createdAt: '2024-03-14 14:20:00',
      description: 'Refund for cancelled order'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVerify = (transactionId) => {
    console.log('Verifying transaction:', transactionId);
    // Here you would typically make an API call to verify the transaction
  };

  const handleReject = (transactionId) => {
    console.log('Rejecting transaction:', transactionId);
    // Here you would typically make an API call to reject the transaction
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Management</h1>
        <p className="text-gray-600">Track, verify, and manage all system transactions</p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Transaction ID or User Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{transaction.id}</h3>
                  <Badge className={`${getStatusColor(transaction.status)} border-0`}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(transaction.status)}
                      <span className="capitalize">{transaction.status}</span>
                    </div>
                  </Badge>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                    {transaction.type}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">User</p>
                    <p className="font-medium">{transaction.userName}</p>
                    <p className="text-gray-400 text-xs">{transaction.userId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-medium text-lg">{transaction.amount.toLocaleString('vi-VN')} VND</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium">{new Date(transaction.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-gray-500 text-sm">Description</p>
                  <p className="text-gray-900">{transaction.description}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-6">
                <Button size="sm" variant="outline" className="border-gray-300">
                  <Eye size={16} className="mr-1" />
                  View Details
                </Button>
                
                {transaction.status === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleVerify(transaction.id)}
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Verify
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(transaction.id)}
                    >
                      <XCircle size={16} className="mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No transactions found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
};

export default TransactionManagement;