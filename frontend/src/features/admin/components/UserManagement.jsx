import { useState } from 'react';
import { Search, Filter, Eye, Lock, Unlock, User, Mail, Phone, Calendar } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [users, setUsers] = useState([
    {
      id: 'USR001',
      name: 'Nguyen Van A',
      email: 'nguyenvana@email.com',
      phone: '+84 901 234 567',
      status: 'active',
      role: 'user',
      joinDate: '2024-01-15',
      lastLogin: '2024-03-15 10:30:00',
      totalListings: 5,
      totalTransactions: 12,
      verified: true
    },
    {
      id: 'USR002',
      name: 'Tran Thi B',
      email: 'tranthib@email.com',
      phone: '+84 902 345 678',
      status: 'locked',
      role: 'user',
      joinDate: '2024-02-20',
      lastLogin: '2024-03-10 15:45:00',
      totalListings: 2,
      totalTransactions: 3,
      verified: false
    },
    {
      id: 'USR003',
      name: 'Le Van C',
      email: 'levanc@email.com',
      phone: '+84 903 456 789',
      status: 'active',
      role: 'premium',
      joinDate: '2023-12-05',
      lastLogin: '2024-03-14 20:15:00',
      totalListings: 15,
      totalTransactions: 28,
      verified: true
    },
    {
      id: 'USR004',
      name: 'Pham Thi D',
      email: 'phamthid@email.com',
      phone: '+84 904 567 890',
      status: 'active',
      role: 'user',
      joinDate: '2024-03-01',
      lastLogin: '2024-03-13 08:30:00',
      totalListings: 1,
      totalTransactions: 1,
      verified: true
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'locked':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLockUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: 'locked' }
        : user
    ));
    console.log('Locking user:', userId);
  };

  const handleUnlockUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: 'active' }
        : user
    ));
    console.log('Unlocking user:', userId);
  };

  const handleViewDetails = (userId) => {
    console.log('Viewing user details:', userId);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">View user information and manage account status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {users.filter(u => u.status === 'locked').length}
            </p>
            <p className="text-sm text-gray-600">Locked Users</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'premium').length}
            </p>
            <p className="text-sm text-gray-600">Premium Users</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by User ID, Name, or Email..."
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
              <option value="active">Active</option>
              <option value="locked">Locked</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <Badge className={`${getStatusColor(user.status)} border-0`}>
                      {user.status}
                    </Badge>
                    <Badge className={`${getRoleColor(user.role)} border-0`}>
                      {user.role}
                    </Badge>
                    {user.verified && (
                      <Badge className="bg-blue-100 text-blue-800 border-0">
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 font-medium">ID:</span>
                      <span>{user.id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{user.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">Joined: {new Date(user.joinDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-500">Listings:</span>
                      <span className="ml-1 font-medium text-blue-600">{user.totalListings}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Transactions:</span>
                      <span className="ml-1 font-medium text-green-600">{user.totalTransactions}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Login:</span>
                      <span className="ml-1 text-gray-700">
                        {new Date(user.lastLogin).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2 ml-6">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-gray-300"
                  onClick={() => handleViewDetails(user.id)}
                >
                  <Eye size={16} className="mr-1" />
                  View Details
                </Button>
                
                {user.status === 'active' ? (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => handleLockUser(user.id)}
                  >
                    <Lock size={16} className="mr-1" />
                    Lock Account
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleUnlockUser(user.id)}
                  >
                    <Unlock size={16} className="mr-1" />
                    Unlock Account
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No users found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;