import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/shadcn-ui/Default-Ui/card';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Input } from 'src/components/shadcn-ui/Default-Ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/shadcn-ui/Default-Ui/select';
import { Icon } from '@iconify/react';

const FindLocation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');

  const locationData = [
    { 
      id: '1', 
      name: 'CS-101', 
      type: 'Lecture Hall', 
      building: 'Computer Science Building', 
      floor: '1st Floor',
      capacity: 60,
      equipment: 'Projector, Whiteboard, Air Conditioning',
      location: 'North Wing, Room 101',
      coordinates: 'Building A, Floor 1, Room 101'
    },
    { 
      id: '2', 
      name: 'LAB-001', 
      type: 'Computer Lab', 
      building: 'Computer Science Building', 
      floor: 'Ground Floor',
      capacity: 30,
      equipment: '30 PCs, Projector, Network Access',
      location: 'South Wing, Lab 001',
      coordinates: 'Building A, Ground Floor, Lab 001'
    },
    { 
      id: '3', 
      name: 'LIB-001', 
      type: 'Library', 
      building: 'Central Library', 
      floor: '2nd Floor',
      capacity: 200,
      equipment: 'Books, Computers, Study Areas',
      location: 'Main Library, Study Section',
      coordinates: 'Central Building, Floor 2, Library'
    },
    { 
      id: '4', 
      name: 'CAF-001', 
      type: 'Cafeteria', 
      building: 'Student Center', 
      floor: 'Ground Floor',
      capacity: 150,
      equipment: 'Food Counters, Seating Area',
      location: 'Student Center, Food Court',
      coordinates: 'Student Center, Ground Floor, Cafeteria'
    },
    { 
      id: '5', 
      name: 'GYM-001', 
      type: 'Gymnasium', 
      building: 'Sports Complex', 
      floor: 'Ground Floor',
      capacity: 50,
      equipment: 'Exercise Equipment, Changing Rooms',
      location: 'Sports Complex, Main Gym',
      coordinates: 'Sports Building, Ground Floor, Gym'
    },
  ];

  const buildings = [...new Set(locationData.map(item => item.building))];
  const types = [...new Set(locationData.map(item => item.type))];

  const filteredLocations = locationData.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.location.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(location => 
    (!selectedType || location.type === selectedType) &&
    (!selectedBuilding || location.building === selectedBuilding)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Find Location</h1>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Search by room name, building, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Buildings</SelectItem>
                  {buildings.map((building) => (
                    <SelectItem key={building} value={building}>
                      {building}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLocations.map((location) => (
          <Card key={location.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Icon 
                    icon={
                      location.type === 'Lecture Hall' ? 'solar:home-2-line-duotone' :
                      location.type === 'Computer Lab' ? 'solar:monitor-line-duotone' :
                      location.type === 'Library' ? 'solar:book-2-line-duotone' :
                      location.type === 'Cafeteria' ? 'solar:cup-hot-line-duotone' :
                      'solar:dumbbell-line-duotone'
                    } 
                    className="text-primary" 
                  />
                  {location.name}
                </CardTitle>
                <Badge variant="secondary">{location.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:buildings-line-duotone" className="text-gray-500" />
                  <span className="text-sm">{location.building}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:stairs-up-line-duotone" className="text-gray-500" />
                  <span className="text-sm">{location.floor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:map-point-line-duotone" className="text-gray-500" />
                  <span className="text-sm">{location.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="solar:users-group-two-rounded-line-duotone" className="text-gray-500" />
                  <span className="text-sm">Capacity: {location.capacity}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Equipment:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{location.equipment}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Coordinates:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{location.coordinates}</p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Icon icon="solar:map-point-line-duotone" className="mr-2" />
                  Get Directions
                </Button>
                <Button size="sm" variant="outline">
                  <Icon icon="solar:share-line-duotone" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Icon icon="solar:magnifer-line-duotone" className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No locations found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or browse all locations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FindLocation;
