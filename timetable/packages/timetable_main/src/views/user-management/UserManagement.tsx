import React, { useState, useEffect } from 'react';
import { Button, Badge, ToggleSwitch, Pagination } from 'flowbite-react';
import { Trash2, Plus, Edit, Users, CheckCircle, BookOpen, Search, GraduationCap } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from 'src/components/shadcn-ui/Default-Ui/form';
import { Input } from 'src/components/shadcn-ui/Default-Ui/input';
import { useForm } from 'react-hook-form';
import { facultyService, Faculty, FacultyForm } from '../../services/facultyService';
import SpecializationChart from '../../components/SpecializationChart';

const UserManagement: React.FC = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items per page
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byDepartment: {} as Record<string, number>,
    byDesignation: {} as Record<string, number>,
    bySpecialization: {} as Record<string, number>,
  });

  const form = useForm<FacultyForm>({
    defaultValues: {
      name: '',
      email: '',
      department: 'DTU',
      designation: 'Professor',
      specialization: '',
      is_active: true
    }
  });

  // Load faculty data on component mount
  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    setLoading(true);
    try {
      const facultyData = await facultyService.getFaculty();
      const facultyStats = await facultyService.getFacultyStats();
      setFaculty(facultyData);
      setStats(facultyStats);
    } catch (error) {
      console.error('Error loading faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaculty = async (data: FacultyForm) => {
    try {
      const newFaculty = await facultyService.addFaculty(data);
      if (newFaculty) {
        await loadFaculty(); // Reload data
        setShowAddModal(false);
        form.reset();
      }
    } catch (error) {
      console.error('Error adding faculty:', error);
    }
  };

  const handleEditFaculty = (facultyMember: Faculty) => {
    setEditingFaculty(facultyMember);
    form.reset({
      name: facultyMember.name,
      email: facultyMember.email,
      department: facultyMember.department,
      designation: facultyMember.designation,
      specialization: facultyMember.specialization,
      is_active: facultyMember.is_active
    });
    setShowAddModal(true);
  };

  const handleUpdateFaculty = async (data: FacultyForm) => {
    if (editingFaculty) {
      try {
        const updatedFaculty = await facultyService.updateFaculty(editingFaculty.id, data);
        if (updatedFaculty) {
          await loadFaculty(); // Reload data
          setEditingFaculty(null);
          setShowAddModal(false);
          form.reset();
        }
      } catch (error) {
        console.error('Error updating faculty:', error);
      }
    }
  };

  const handleDeleteFaculty = async (facultyId: string) => {
    try {
      const success = await facultyService.deleteFaculty(facultyId);
      if (success) {
        await loadFaculty(); // Reload data
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  const toggleFacultyStatus = async (facultyId: string) => {
    try {
      const updatedFaculty = await facultyService.toggleFacultyStatus(facultyId);
      if (updatedFaculty) {
        await loadFaculty(); // Reload data
      }
    } catch (error) {
      console.error('Error toggling faculty status:', error);
    }
  };

  // Filter faculty based on search query
  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFaculty = filteredFaculty.slice(startIndex, endIndex);

  // Reset to first page when search query or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDesignationColor = (designation: string) => {
    switch (designation) {
      case 'Professor': return 'blue';
      case 'Associate Professor': return 'green';
      case 'Assistant Professor': return 'yellow';
      case 'Lecturer': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'success' : 'failure';
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Faculty Management</h1>
            <p className="text-gray-600 mt-1">Manage faculty members, designations, and specializations</p>
          </div>
          <Button 
            color="primary" 
            onClick={() => {
              setEditingFaculty(null);
              form.reset();
              setShowAddModal(true);
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Faculty
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search faculty by name, email, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Faculty</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Faculty</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Professors</p>
                <p className="text-2xl font-bold text-purple-600">{stats.byDesignation.Professor || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Specialization Breakdown Chart */}
        {Object.keys(stats.bySpecialization).length > 0 && (
          <SpecializationChart specializationData={stats.bySpecialization} />
        )}

        {/* Faculty Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-lg font-semibold text-gray-900">All Faculty Members</h3>
              {!loading && filteredFaculty.length > 0 && (
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages} • {filteredFaculty.length} total members
                </div>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading faculty data...</div>
            </div>
          ) : filteredFaculty.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
              <div className="text-gray-500 text-lg font-medium mb-2">No faculty members found</div>
              <div className="text-gray-400 text-sm">
                {searchQuery ? 'Try adjusting your search criteria' : 'No faculty members available'}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentFaculty.map((facultyMember) => (
                    <tr key={facultyMember.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{facultyMember.name}</div>
                            <div className="text-sm text-gray-500">ID: {facultyMember.instructor_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{facultyMember.email}</div>
                        <div className="text-sm text-gray-500">{facultyMember.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={getDesignationColor(facultyMember.designation)} className="text-xs">
                          {facultyMember.designation}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {facultyMember.specialization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={getStatusColor(facultyMember.is_active)} className="text-xs">
                          {facultyMember.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditFaculty(facultyMember)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleFacultyStatus(facultyMember.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <ToggleSwitch checked={facultyMember.is_active} onChange={() => {}} />
                          </button>
                          <button
                            onClick={() => handleDeleteFaculty(facultyMember.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && filteredFaculty.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredFaculty.length)} of {filteredFaculty.length} faculty members
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Items per page:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                }}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                showIcons
                className="flex justify-center"
              />
            </div>
          </div>
        )}

        {/* Add/Edit Faculty Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingFaculty(null);
                    form.reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(editingFaculty ? handleUpdateFaculty : handleAddFaculty)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department *</FormLabel>
                        <FormControl>
                          <select 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            {...field}
                          >
                            <option value="DTU">DTU</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Applied Mathematics">Applied Mathematics</option>
                            <option value="Applied Chemistry">Applied Chemistry</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation *</FormLabel>
                        <FormControl>
                          <select 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            {...field}
                          >
                            <option value="Professor">Professor</option>
                            <option value="Associate Professor">Associate Professor</option>
                            <option value="Assistant Professor">Assistant Professor</option>
                            <option value="Lecturer">Lecturer</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter specialization (e.g., AM101, ME101)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <ToggleSwitch checked={field.value} onChange={field.onChange} />
                          <FormLabel>Active Status</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      color="light"
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingFaculty(null);
                        form.reset();
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" color="primary" className="flex-1">
                      {editingFaculty ? 'Update Faculty' : 'Add Faculty'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
