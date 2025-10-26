import { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';

const ListingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [listings, setListings] = useState([
    {
      id: 'LST001',
      title: 'Honda Wave 2020 - Excellent Condition',
      userId: 'USR123',
      userName: 'Nguyen Van A',
      price: 25000000,
      status: 'pending',
      category: 'Motorcycle',
      location: 'Ho Chi Minh City',
      createdAt: '2024-03-15 10:30:00',
      images: ['image1.jpg', 'image2.jpg'],
      description: 'Well-maintained Honda Wave 2020 with low mileage...'
    },
    {
      id: 'LST002',
      title: 'Yamaha Exciter 150 2021',
      userId: 'USR456',
      userName: 'Tran Thi B',
      price: 45000000,
      status: 'approved',
      category: 'Motorcycle',
      location: 'Hanoi',
      createdAt: '2024-03-14 16:45:00',
      images: ['image3.jpg'],
      description: 'Sporty Yamaha Exciter 150 in perfect condition...'
    },
    {
      id: 'LST003',
      title: 'Vespa Primavera 2019',
      userId: 'USR789',
      userName: 'Le Van C',
      price: 65000000,
      status: 'rejected',
      category: 'Scooter',
      location: 'Da Nang',
      createdAt: '2024-03-14 09:20:00',
      images: ['image4.jpg', 'image5.jpg', 'image6.jpg'],
      description: 'Classic Vespa Primavera with elegant design...',
      rejectionReason: 'Insufficient documentation provided'
    },
    {
      id: 'LST004',
      title: 'SH Mode 2022 - Like New',
      userId: 'USR321',
      userName: 'Pham Thi D',
      price: 55000000,
      status: 'pending',
      category: 'Scooter',
      location: 'Ho Chi Minh City',
      createdAt: '2024-03-13 14:15:00',
      images: ['image7.jpg'],
      description: 'Nearly new SH Mode 2022 with full accessories...'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (listingId) => {
    setListings(listings.map(listing => 
      listing.id === listingId 
        ? { ...listing, status: 'approved' }
        : listing
    ));
    console.log('Approving listing:', listingId);
  };

  const handleReject = (listingId, reason = 'Does not meet quality standards') => {
    setListings(listings.map(listing => 
      listing.id === listingId 
        ? { ...listing, status: 'rejected', rejectionReason: reason }
        : listing
    ));
    console.log('Rejecting listing:', listingId, 'Reason:', reason);
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Listing Management</h1>
        <p className="text-gray-600">Review, approve, and manage user listings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {listings.filter(l => l.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pending Review</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {listings.filter(l => l.status === 'approved').length}
            </p>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {listings.filter(l => l.status === 'rejected').length}
            </p>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{listings.length}</p>
            <p className="text-sm text-gray-600">Total Listings</p>
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
                placeholder="Search by Listing ID, Title, or User Name..."
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Listings List */}
      <div className="space-y-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Listing Image */}
              <div className="w-full lg:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  {listing.images.length} image(s)
                </span>
              </div>

              {/* Listing Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{listing.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{listing.id}</span>
                      <span>•</span>
                      <span>{listing.category}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.location}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(listing.status)} border-0`}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(listing.status)}
                      <span className="capitalize">{listing.status}</span>
                    </div>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Seller</p>
                    <p className="font-medium">{listing.userName}</p>
                    <p className="text-xs text-gray-400">{listing.userId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-lg font-bold text-blue-600">
                      {listing.price.toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700 text-sm line-clamp-2">{listing.description}</p>
                </div>

                {listing.status === 'rejected' && listing.rejectionReason && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Rejection Reason:</strong> {listing.rejectionReason}
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  Created: {new Date(listing.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2 lg:w-32">
                <Button size="sm" variant="outline" className="border-gray-300">
                  <Eye size={16} className="mr-1" />
                  View
                </Button>
                
                {listing.status === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(listing.id)}
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(listing.id)}
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

      {filteredListings.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No listings found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
};

export default ListingManagement;