import { useState } from 'react';
import { Edit, Save, X, DollarSign } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

const SystemFeesManagement = () => {
  const [fees, setFees] = useState([
    {
      id: 1,
      name: 'Transaction Fee',
      type: 'percentage',
      value: 2.5,
      description: 'Fee charged on each successful transaction',
      isEditing: false
    },
    {
      id: 2,
      name: 'Listing Fee',
      type: 'fixed',
      value: 10,
      description: 'One-time fee for posting a listing',
      isEditing: false
    },
    {
      id: 3,
      name: 'Premium Listing Fee',
      type: 'fixed',
      value: 25,
      description: 'Enhanced listing with premium features',
      isEditing: false
    },
    {
      id: 4,
      name: 'Withdrawal Fee',
      type: 'percentage',
      value: 1.0,
      description: 'Fee for withdrawing funds to bank account',
      isEditing: false
    }
  ]);

  const [editingValues, setEditingValues] = useState({});

  const handleEdit = (feeId) => {
    setFees(fees.map(fee => 
      fee.id === feeId ? { ...fee, isEditing: true } : fee
    ));
    const fee = fees.find(f => f.id === feeId);
    setEditingValues({ ...editingValues, [feeId]: fee.value });
  };

  const handleSave = (feeId) => {
    setFees(fees.map(fee => 
      fee.id === feeId 
        ? { ...fee, isEditing: false, value: editingValues[feeId] || fee.value }
        : fee
    ));
    // Here you would typically make an API call to save the changes
    console.log('Saving fee changes for ID:', feeId);
  };

  const handleCancel = (feeId) => {
    setFees(fees.map(fee => 
      fee.id === feeId ? { ...fee, isEditing: false } : fee
    ));
    setEditingValues({ ...editingValues, [feeId]: undefined });
  };

  const handleValueChange = (feeId, value) => {
    setEditingValues({ ...editingValues, [feeId]: parseFloat(value) || 0 });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Fees Management</h1>
        <p className="text-gray-600">Configure and manage system fees and charges</p>
      </div>

      <div className="grid gap-6">
        {fees.map((fee) => (
          <Card key={fee.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{fee.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{fee.description}</p>
                  
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Current Rate:</span>
                      {fee.isEditing ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            value={editingValues[fee.id] || fee.value}
                            onChange={(e) => handleValueChange(fee.id, e.target.value)}
                            className="w-24"
                          />
                          <span className="text-sm text-gray-500">
                            {fee.type === 'percentage' ? '%' : '$'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-semibold text-blue-600">
                          {fee.value}{fee.type === 'percentage' ? '%' : '$'}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Type:</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 capitalize">
                        {fee.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {fee.isEditing ? (
                  <>
                    <Button
                      onClick={() => handleSave(fee.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save size={16} />
                    </Button>
                    <Button
                      onClick={() => handleCancel(fee.id)}
                      size="sm"
                      variant="outline"
                      className="border-gray-300"
                    >
                      <X size={16} />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleEdit(fee.id)}
                    size="sm"
                    variant="outline"
                    className="border-gray-300"
                  >
                    <Edit size={16} />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Fee Summary */}
      <Card className="p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fees.map((fee) => (
            <div key={fee.id} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{fee.name}</p>
              <p className="text-xl font-bold text-gray-900">
                {fee.value}{fee.type === 'percentage' ? '%' : '$'}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SystemFeesManagement;