import React, { useState, useMemo } from 'react';
import CardBox from 'src/components/shared/CardBox';
import { Button } from 'src/components/shadcn-ui/Default-Ui/button';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'src/components/shadcn-ui/Default-Ui/dropdown-menu';
import { Icon } from '@iconify/react';
import { 
  MoreVertical, 
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { 
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";

interface Timetable {
  id: string;
  name: string;
  status: 'published' | 'draft';
  updatedAt: string;
  createdAt: string;
  isAIGenerated?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  sharedWith?: string[];
}

const columnHelper = createColumnHelper<Timetable>();

const MyTimetables: React.FC = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([
    {
      id: '1',
      name: 'TIME TABLE',
      status: 'published',
      updatedAt: '2025-09-07',
      createdAt: '2025-09-06',
      isAIGenerated: false,
      approvalStatus: 'approved',
      sharedWith: ['Dr. Smith', 'Prof. Johnson']
    },
    {
      id: '2',
      name: 'Draft Timetable 1',
      status: 'draft',
      updatedAt: '2025-09-09',
      createdAt: '2025-09-09',
      isAIGenerated: true,
      approvalStatus: 'pending'
    },
    {
      id: '3',
      name: 'Draft Timetable 2',
      status: 'draft',
      updatedAt: '2025-09-07',
      createdAt: '2025-09-07',
      isAIGenerated: true,
      approvalStatus: 'pending'
    },
    {
      id: '4',
      name: 'Draft Timetable 3',
      status: 'draft',
      updatedAt: '2025-09-07',
      createdAt: '2025-09-07',
      isAIGenerated: true,
      approvalStatus: 'pending'
    },
    {
      id: '5',
      name: 'Draft Timetable 4',
      status: 'draft',
      updatedAt: '2025-09-07',
      createdAt: '2025-09-07',
      isAIGenerated: true,
      approvalStatus: 'pending'
    },
    {
      id: '6',
      name: 'Draft Timetable 5',
      status: 'draft',
      updatedAt: '2025-09-07',
      createdAt: '2025-09-07',
      isAIGenerated: true,
      approvalStatus: 'pending'
    },
    {
      id: '7',
      name: 'Draft Timetable 6',
      status: 'draft',
      updatedAt: '2025-09-07',
      createdAt: '2025-09-07',
      isAIGenerated: true,
      approvalStatus: 'pending'
    },
    {
      id: '8',
      name: 'Draft Timetable 7',
      status: 'draft',
      updatedAt: '2025-09-07',
      createdAt: '2025-09-07',
      isAIGenerated: true,
      approvalStatus: 'pending'
    }
  ]);

  // Table columns definition
  const columns = [
    columnHelper.accessor("name", {
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div
            className={
              `h-10 w-10 rounded-lg flex items-center justify-center shadow-sm ` +
              (info.row.original.status === 'published'
                ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                : 'bg-gradient-to-br from-slate-400 to-slate-600')
            }
          >
            <Icon
              icon={
                info.row.original.status === 'published'
                  ? 'solar:calendar-bold-duotone'
                  : 'solar:document-add-line-duotone'
              }
              className="text-white h-5 w-5"
            />
          </div>
          <div>
            <h6 className="text-base font-semibold text-gray-900">{info.getValue()}</h6>
            <p className="text-sm text-gray-500">ID: {info.row.original.id}</p>
          </div>
        </div>
      ),
      header: () => <span className="font-semibold">Timetable Name</span>,
    }),
    columnHelper.accessor("status", {
      cell: (info) => (
        <Badge 
          variant={info.getValue() === 'published' ? "lightSuccess" : "outline"} 
          className={info.getValue() === 'published' ? "text-success" : "text-slate-700 border-slate-300"}
        >
          <Icon 
            icon={info.getValue() === 'published' ? "solar:check-circle-line-duotone" : "solar:document-add-line-duotone"} 
            className="h-3 w-3 mr-1" 
          />
          {info.getValue() === 'published' ? 'Published' : 'Draft'}
        </Badge>
      ),
      header: () => <span className="font-semibold">Status</span>,
    }),
    columnHelper.accessor("updatedAt", {
      cell: (info) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Icon icon="solar:calendar-line-duotone" className="h-4 w-4" />
          {formatDate(info.getValue())}
        </div>
      ),
      header: () => <span className="font-semibold">Last Updated</span>,
    }),
    columnHelper.accessor("createdAt", {
      cell: (info) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Icon icon="solar:document-text-line-duotone" className="h-4 w-4" />
          {formatDate(info.getValue())}
        </div>
      ),
      header: () => <span className="font-semibold">Created</span>,
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => (
        <div className="flex items-center gap-2">
          {info.row.original.status === 'draft' ? (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handlePublish(info.row.original.id)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-0"
            >
              <Icon icon="solar:check-circle-line-duotone" className="h-4 w-4" />
              Publish
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleUnpublish(info.row.original.id)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white border-0"
            >
              <Icon icon="solar:refresh-line-duotone" className="h-4 w-4" />
              Unpublish
            </Button>
          )}
          <Button 
            variant="outlineinfo" 
            size="sm"
            className="flex items-center gap-2 hover:bg-blue-50 transition-colors"
          >
            <Icon icon="solar:edit-line-duotone" className="h-4 w-4" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 transition-colors">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleDuplicate(info.row.original.id)} className="cursor-pointer">
                <Icon icon="solar:copy-line-duotone" className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Icon icon="solar:archive-line-duotone" className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(info.row.original)} 
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Icon icon="solar:trash-bin-minimalistic-line-duotone" className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      header: () => <span className="font-semibold">Actions</span>,
    }),
  ];

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [timetableToDelete, setTimetableToDelete] = useState<Timetable | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Filtered data based on search and status filter
  const filteredTimetables = useMemo(() => {
    return timetables.filter(timetable => {
      const matchesSearch = timetable.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || timetable.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [timetables, searchTerm, statusFilter]);

  const publishedTimetables = timetables.filter(t => t.status === 'published');
  const draftTimetables = timetables.filter(t => t.status === 'draft');

  // Table configuration
  const table = useReactTable({
    data: filteredTimetables,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handlePublish = (id: string) => {
    setTimetables(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'published' as const } : t
    ));
  };

  const handleUnpublish = (id: string) => {
    setTimetables(prev => prev.map(t => 
      t.id === id ? { ...t, status: 'draft' as const } : t
    ));
  };

  const handleDeleteClick = (timetable: Timetable) => {
    setTimetableToDelete(timetable);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (timetableToDelete) {
      setTimetables(prev => prev.filter(t => t.id !== timetableToDelete.id));
      setShowDeleteModal(false);
      setTimetableToDelete(null);
    }
  };

  const handleDuplicate = (id: string) => {
    const timetable = timetables.find(t => t.id === id);
    if (timetable) {
      const newTimetable: Timetable = {
        ...timetable,
        id: Date.now().toString(),
        name: `${timetable.name} (Copy)`,
        status: 'draft',
        updatedAt: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        approvalStatus: 'pending'
      };
      setTimetables(prev => [...prev, newTimetable]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Timetables Management</h1>
        <p className="text-gray-600 text-lg">Manage all your timetables and track their status with professional tools</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardBox className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <Icon icon="solar:calendar-line-duotone" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h5 className="text-2xl font-bold text-blue-900">{timetables.length}</h5>
              <p className="text-blue-700 font-medium">Total Timetables</p>
            </div>
          </div>
        </CardBox>

        <CardBox className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <Icon icon="solar:check-circle-line-duotone" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h5 className="text-2xl font-bold text-blue-900">{publishedTimetables.length}</h5>
              <p className="text-blue-700 font-medium">Published</p>
            </div>
          </div>
        </CardBox>

        <CardBox className="bg-gradient-to-br from-slate-50 to-white border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-slate-500 flex items-center justify-center shadow-sm">
              <Icon icon="solar:document-add-line-duotone" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h5 className="text-2xl font-bold text-slate-900">{draftTimetables.length}</h5>
              <p className="text-slate-700 font-medium">Drafts</p>
            </div>
          </div>
        </CardBox>
      </div>

      {/* Professional Timetables Table */}
      <CardBox className="p-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Icon icon="solar:calendar-bold-duotone" className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900">Timetables Management</h2>
              <Badge variant="outline" className="text-primary border-primary/30">
                {filteredTimetables.length}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghostprimary" 
                onClick={() => setShowAIAssistant(true)}
                className="flex items-center gap-2"
              >
                <Icon icon="solar:magic-stick-3-line-duotone" className="h-4 w-4" />
                AI Assistant
              </Button>
              <Button 
                variant="default"
                className="flex items-center gap-2"
              >
                <Icon icon="solar:add-circle-line-duotone" className="h-4 w-4" />
                New Timetable
              </Button>
            </div>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Icon icon="solar:magnifer-line-duotone" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search timetables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <Button variant="outline" className="flex items-center gap-2">
                <Icon icon="solar:filter-line-duotone" className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{' '}
                of {table.getFilteredRowModel().rows.length} results
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  {[5, 10, 20, 30].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="p-2"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="p-2"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardBox>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CardBox className="max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-lightprimary flex items-center justify-center">
                  <Icon icon="solar:magic-stick-3-line-duotone" className="h-5 w-5 text-primary" />
                </div>
                AI Timetable Assistant
              </h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowAIAssistant(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-6">
              <CardBox className="bg-lightprimary border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <Icon icon="solar:magic-stick-3-line-duotone" className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold text-primary">AI Recommendations</h4>
                </div>
                <p className="text-sm text-primary mb-3">
                  Based on your draft timetables, I recommend focusing on these candidates:
                </p>
                <ul className="text-sm text-primary space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    Candidate #2: Best teacher distribution
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    Candidate #3: Optimal room utilization
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    Candidate #5: Minimal conflicts
                  </li>
                </ul>
              </CardBox>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <Button 
                variant="ghost" 
                onClick={() => setShowAIAssistant(false)}
              >
                Close
              </Button>
              <Button 
                variant="default"
                onClick={() => setShowAIAssistant(false)}
                className="flex items-center gap-2"
              >
                <Icon icon="solar:magic-stick-3-line-duotone" className="h-4 w-4" />
                Apply Recommendations
              </Button>
            </div>
          </CardBox>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && timetableToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CardBox className="max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <Icon icon="solar:trash-bin-minimalistic-line-duotone" className="h-5 w-5 text-red-600" />
                </div>
                Delete Timetable
              </h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete <strong>"{timetableToDelete.name}"</strong>? 
                This action cannot be undone.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <Icon icon="solar:danger-triangle-line-duotone" className="h-4 w-4" />
                  <span className="text-sm font-medium">Warning</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  All timetable data, including schedules, assignments, and associated configurations will be permanently removed.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <Button 
                variant="ghost" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteConfirm}
                className="flex items-center gap-2"
              >
                <Icon icon="solar:trash-bin-minimalistic-line-duotone" className="h-4 w-4" />
                Delete Timetable
              </Button>
            </div>
          </CardBox>
        </div>
      )}
    </div>
  );
};

export default MyTimetables;