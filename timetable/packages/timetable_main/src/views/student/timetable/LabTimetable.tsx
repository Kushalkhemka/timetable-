import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Input } from 'src/components/shadcn-ui/Default-Ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/shadcn-ui/Default-Ui/select';
import { Icon } from '@iconify/react';

const LabTimetable: React.FC = () => {
  const [selectedLab, setSelectedLab] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const labData = [
    { id: '1', name: 'LAB-001', type: 'Computer Lab', capacity: 30, building: 'Computer Science Building', equipment: '30 PCs, Projector' },
    { id: '2', name: 'LAB-002', type: 'Computer Lab', capacity: 25, building: 'Computer Science Building', equipment: '25 PCs, Smart Board' },
    { id: '3', name: 'LAB-003', type: 'Programming Lab', capacity: 20, building: 'Computer Science Building', equipment: '20 PCs, Development Tools' },
    { id: '4', name: 'PHYS-LAB-01', type: 'Physics Lab', capacity: 15, building: 'Physics Building', equipment: 'Physics Equipment, Measuring Tools' },
    { id: '5', name: 'CHEM-LAB-01', type: 'Chemistry Lab', capacity: 20, building: 'Chemistry Building', equipment: 'Chemistry Equipment, Safety Gear' },
    { id: '6', name: 'ELEC-LAB-01', type: 'Electronics Lab', capacity: 18, building: 'Electronics Building', equipment: 'Oscilloscopes, Multimeters' },
  ];

  const timetableData = [
    { lab: 'LAB-001', time: '09:00 - 11:00', subject: 'Programming Lab', faculty: 'Dr. Smith', day: 'Monday', batch: 'CS-3A' },
    { lab: 'LAB-002', time: '11:00 - 13:00', subject: 'Database Lab', faculty: 'Dr. Johnson', day: 'Monday', batch: 'CS-3B' },
    { lab: 'LAB-003', time: '14:00 - 16:00', subject: 'Web Development Lab', faculty: 'Dr. Brown', day: 'Monday', batch: 'CS-3C' },
    { lab: 'PHYS-LAB-01', time: '10:00 - 12:00', subject: 'Physics Lab', faculty: 'Dr. Wilson', day: 'Monday', batch: 'PHY-2A' },
    { lab: 'ELEC-LAB-01', time: '15:00 - 17:00', subject: 'Electronics Lab', faculty: 'Dr. Davis', day: 'Monday', batch: 'ECE-3A' },
  ];

  const filteredLabs = labData.filter(lab =>
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTimetable = selectedLab 
    ? timetableData.filter(item => item.lab === selectedLab)
    : timetableData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lab Timetable</h1>
      </div>

      {/* Search and Filter */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Search Labs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by lab name, building, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedLab} onValueChange={setSelectedLab}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Lab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Labs</SelectItem>
                {labData.map((lab) => (
                  <SelectItem key={lab.id} value={lab.name}>
                    {lab.name} - {lab.building}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lab List */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Available Labs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors shadow-sm ${
                  selectedLab === lab.name
                    ? 'bg-primary/5 border border-primary/20'
                    : 'bg-white dark:bg-gray-800 hover:shadow-md'
                }`}
                onClick={() => setSelectedLab(lab.name)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon 
                      icon={lab.type.includes('Computer') ? 'solar:monitor-line-duotone' : 
                            lab.type.includes('Physics') ? 'solar:atom-line-duotone' :
                            lab.type.includes('Chemistry') ? 'solar:flask-line-duotone' :
                            'solar:microchip-line-duotone'} 
                      className="text-primary" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{lab.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{lab.building}</p>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{lab.type}</Badge>
                    <span className="text-xs text-gray-500">Capacity: {lab.capacity}</span>
                  </div>
                  <p className="text-xs text-gray-500">{lab.equipment}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lab Timetable */}
      {selectedLab && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon icon="solar:microchip-line-duotone" className="text-primary" />
              {selectedLab} Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Day</th>
                    <th className="text-left p-3 font-semibold">Time</th>
                    <th className="text-left p-3 font-semibold">Subject</th>
                    <th className="text-left p-3 font-semibold">Faculty</th>
                    <th className="text-left p-3 font-semibold">Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTimetable.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">
                        <Badge variant="outline">{item.day}</Badge>
                      </td>
                      <td className="p-3 font-medium">{item.time}</td>
                      <td className="p-3">{item.subject}</td>
                      <td className="p-3">{item.faculty}</td>
                      <td className="p-3">
                        <Badge variant="secondary">{item.batch}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LabTimetable;
