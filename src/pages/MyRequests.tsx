import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import { RequestCard } from '../components/RequestCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import { QuickViewModal } from '../components/QuickViewModal';
import { StatusUpdateModal } from '../components/StatusUpdateModal';
import { CampusRequest, RequestCategory, RequestStatus } from '../types';
import { formatDate, formatRelativeTime } from '../utils/dateUtils';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  PlusCircle,
  Inbox,
  FilterX,
  ExternalLink,
  MapPin,
  Calendar,
  ArrowUpDown,
} from 'lucide-react';

const CATEGORIES: RequestCategory[] = [
  'Electrical',
  'Plumbing',
  'Wi-Fi / Internet',
  'Classroom / Laboratory',
  'Cleaning and Maintenance',
  'Hostel',
  'Transport',
  'Canteen',
  'Other',
];

export const MyRequests: React.FC = () => {
  const { requests, loading } = useRequests();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [quickViewItem, setQuickViewItem] = useState<CampusRequest | null>(null);
  const [statusUpdateItem, setStatusUpdateItem] = useState<CampusRequest | null>(null);

  const filteredRequests = useMemo(() => {
    let list = requests.filter((req) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        req.title.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q) ||
        req.location.toLowerCase().includes(q) ||
        req.contactName.toLowerCase().includes(q);

      const matchesCat = categoryFilter === 'all' || req.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'priority') {
        const priorityWeight = { High: 3, Medium: 2, Low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return 0;
    });

    return list;
  }, [requests, searchQuery, categoryFilter, statusFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setSortBy('newest');
  };

  const hasFilters =
    searchQuery !== '' || categoryFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'newest';

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Campus Issues & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor resolution progress, read technician notes, and check ticket status in real-time.
          </p>
        </div>

        <Link
          to="/submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Request</span>
        </Link>
      </div>

      {/* Control Bar: Search, Category, Status, Sort, View Toggle */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, keyword, or room..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 transition-all"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-700 transition-all"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="priority">Sort: High Priority</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Active Counter & Reset Button */}
        {hasFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Showing <strong className="text-slate-800">{filteredRequests.length}</strong> of{' '}
              {requests.length} total tickets
            </span>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No requests match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try broadening your search term or select "All Categories" and "All Statuses".
          </p>
          <div className="pt-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onQuickView={(r) => setQuickViewItem(r)}
            />
          ))}
        </div>
      ) : (
        /* Responsive Table View */
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Ticket ID</th>
                  <th className="py-3.5 px-4">Title & Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 whitespace-nowrap">
                      {req.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <Link
                        to={`/requests/${req.id}`}
                        className="font-bold text-slate-900 hover:text-indigo-600 block line-clamp-1"
                      >
                        {req.title}
                      </Link>
                      <span className="text-[11px] text-slate-400 line-clamp-1">
                        {req.description}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <CategoryBadge category={req.category} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate max-w-[120px]">{req.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {req.contactName}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {formatRelativeTime(req.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={req.priority} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setQuickViewItem(req)}
                          className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded text-xs font-semibold"
                        >
                          Peek
                        </button>
                        <Link
                          to={`/requests/${req.id}`}
                          className="p-1 text-indigo-600 hover:text-indigo-700"
                          title="Open Ticket"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <QuickViewModal
        isOpen={Boolean(quickViewItem)}
        request={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onOpenStatusUpdate={(r) => setStatusUpdateItem(r)}
      />

      <StatusUpdateModal
        isOpen={Boolean(statusUpdateItem)}
        request={statusUpdateItem}
        onClose={() => setStatusUpdateItem(null)}
      />
    </div>
  );
};
