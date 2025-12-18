import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Input } from 'src/components/shadcn-ui/Default-Ui/input';
import { Textarea } from 'src/components/shadcn-ui/Default-Ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/shadcn-ui/Default-Ui/select';
import { Label } from 'src/components/shadcn-ui/Default-Ui/label';
import { Icon } from '@iconify/react';

const LeaveApplication: React.FC = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const leaveTypes = [
    'Medical Leave',
    'Personal Leave',
    'Family Emergency',
    'Academic Leave',
    'Other'
  ];

  const leaveHistory = [
    {
      id: '1',
      type: 'Medical Leave',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      status: 'Approved',
      reason: 'Fever and cold symptoms',
      appliedDate: '2024-01-14',
      approvedBy: 'Dr. Smith'
    },
    {
      id: '2',
      type: 'Personal Leave',
      startDate: '2024-01-20',
      endDate: '2024-01-21',
      status: 'Pending',
      reason: 'Family function',
      appliedDate: '2024-01-19',
      approvedBy: '-'
    },
    {
      id: '3',
      type: 'Academic Leave',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      status: 'Rejected',
      reason: 'Conference attendance',
      appliedDate: '2024-01-24',
      approvedBy: 'Dr. Johnson'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Leave application submitted:', formData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leave Application</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'new'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon icon="solar:document-add-line-duotone" className="mr-2" />
          New Application
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon icon="solar:clock-circle-line-duotone" className="mr-2" />
          Leave History
        </button>
      </div>

      {/* New Application Form */}
      {activeTab === 'new' && (
        <Card>
          <CardHeader>
            <CardTitle>Apply for Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select value={formData.leaveType} onValueChange={(value) => setFormData({...formData, leaveType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Emergency contact person"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <Input
                  id="emergencyPhone"
                  placeholder="Emergency contact phone number"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Leave</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a detailed reason for your leave application..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  required
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  <Icon icon="solar:document-send-line-duotone" className="mr-2" />
                  Submit Application
                </Button>
                <Button type="button" variant="outline">
                  <Icon icon="solar:file-text-line-duotone" className="mr-2" />
                  Save as Draft
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Leave History */}
      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>Leave History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaveHistory.map((leave) => (
                <div key={leave.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon 
                        icon={
                          leave.type === 'Medical Leave' ? 'solar:medical-kit-line-duotone' :
                          leave.type === 'Personal Leave' ? 'solar:user-line-duotone' :
                          leave.type === 'Family Emergency' ? 'solar:home-heart-line-duotone' :
                          'solar:graduation-cap-line-duotone'
                        } 
                        className="text-primary" 
                      />
                      <div>
                        <h3 className="font-semibold">{leave.type}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {leave.startDate} to {leave.endDate}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(leave.status)}>
                      {leave.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Reason:</span> {leave.reason}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Applied on:</span> {leave.appliedDate}
                    </p>
                    {leave.approvedBy !== '-' && (
                      <p className="text-sm">
                        <span className="font-medium">Approved by:</span> {leave.approvedBy}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeaveApplication;
