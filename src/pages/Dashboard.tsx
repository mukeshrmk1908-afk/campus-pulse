import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import { StatCard } from '../components/StatCard';
import { RequestCard } from '../components/RequestCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { StatusUpdateModal } from '../components/StatusUpdateModal';
import { CampusRequest, RequestCategory, RequestStatus } from '../types';
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  Flame,
  Clock,
  CheckCircle2,
  Inbox,
  ArrowRight,
  Sparkles,
  Zap,
  Droplets,
  Wifi,
  GraduationCap,
  Sparkle,
  Building2,
  Bus,
  Utensils,
  HelpCircle,
  FilterX,
} from 'lucide-react';

const CATEGORIES: { label: RequestCategory; icon: React.ReactNode }[] = [
  { label: 'Electrical', icon: <Zap className="w-3.5 h-3.5" /> },
  { label: 'Plumbing', icon: <Droplets className="w-3.5 h-3.5" /> },
  { label: 'Wi-Fi / Internet', icon: <Wifi className="w-3.5 h-3.5" /> },
  { label: 'Classroom / Laboratory', icon: <GraduationCap className="w-3.5 h-3.5" /> },
  { label: 'Cleaning and Maintenance', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { label: 'Hostel', icon: <Building2 className="w-3.5 h-3.5" /> },
  { label: 'Transport', icon: <Bus className="w-3.5 h-3.5" /> },
  { label: 'Canteen', icon: <Utensils className="w-3.5 h-3.5" /> },
  { label: 'Other', icon: <HelpCircle className="w-3.5 h-3.5" /> },
];

export const Dashboard: React.FC = () => {
  const { requests, stats, loading } = useRequests();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [quickViewItem, setQuickViewItem] = useState<CampusRequest | null>(null);
  const [statusUpdateItem, setStatusUpdateItem] = useState<CampusRequest | null>(null);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch =
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.contactName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || req.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'all' || req.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [requests, searchQuery, selectedCategory, selectedStatus]);

  const recentRequests = filteredRequests.slice(0, 6);

  const handleStatCardClick = (status: 'all' | RequestStatus) => {
    if (selectedStatus === status) {
      setSelectedStatus('all');
    } else {
      setSelectedStatus(status);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedStatus !== 'all';

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Vibrant Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white p-6 sm:p-10 shadow-xl shadow-indigo-600/15">
        {/* Glow shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-pink-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Incident & Facility Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Your Campus, <span className="text-pink-200">Better Connected.</span>
          </h1>

          <p className="text-sm sm:text-lg text-indigo-100 font-medium max-w-2xl leading-relaxed">
            Report an issue. Track progress. Make campus life better. Our facility and technical teams are ready to help.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-indigo-900 font-extrabold text-sm shadow-lg shadow-black/10 hover:bg-indigo-50 hover:scale-102 active:scale-95 transition-all"
            >
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              <span>Report an Issue</span>
            </Link>

            <Link
              to="/requests"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/20 transition-all"
            >
              <span>Track All Requests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Summary Stat Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">System Overview</h2>
          <span className="text-xs font-medium text-slate-500">
            Click any metric to filter requests
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Requests"
            value={stats.total}
            subtitle="All logged campus issues"
            gradient="bg-gradient-to-tr from-indigo-600 to-purple-600"
            badgeText="All Time"
            badgeColor="bg-indigo-50 text-indigo-700"
            icon={<Inbox className="w-6 h-6" />}
            isActive={selectedStatus === 'all'}
            onClick={() => handleStatCardClick('all')}
          />
          <StatCard
            title="Open Requests"
            value={stats.open}
            subtitle="Awaiting staff assignment"
            gradient="bg-gradient-to-tr from-rose-500 to-pink-500"
            badgeText="Needs Action"
            badgeColor="bg-rose-50 text-rose-700"
            icon={<Flame className="w-6 h-6" />}
            isActive={selectedStatus === 'Open'}
            onClick={() => handleStatCardClick('Open')}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            subtitle="Staff currently working"
            gradient="bg-gradient-to-tr from-blue-600 to-indigo-600"
            badgeText="Under Review"
            badgeColor="bg-blue-50 text-blue-700"
            icon={<Clock className="w-6 h-6" />}
            isActive={selectedStatus === 'In Progress'}
            onClick={() => handleStatCardClick('In Progress')}
          />
          <StatCard
            title="Resolved"
            value={stats.resolved}
            subtitle="Successfully closed issues"
            gradient="bg-gradient-to-tr from-emerald-500 to-teal-600"
            badgeText="Completed"
            badgeColor="bg-emerald-50 text-emerald-700"
            icon={<CheckCircle2 className="w-6 h-6" />}
            isActive={selectedStatus === 'Resolved'}
            onClick={() => handleStatCardClick('Resolved')}
          />
        </div>
      </section>

      {/* Category Pills Slider / Filter */}
      <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Browse by Department / Category</h3>
            <p className="text-xs text-slate-500">Filter issues by facility domain</p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 self-start sm:self-auto"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({requests.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = requests.filter((r) => r.category === cat.label).length;
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent Requests Section with Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Campus Requests</h2>
            <p className="text-xs text-slate-500">
              Showing {filteredRequests.length} matching issue{filteredRequests.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, title, or room..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs transition-all"
            />
          </div>
        </div>

        {/* Requests Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-48 rounded-2xl bg-white border border-slate-100 animate-pulse p-5 space-y-4"
              >
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-4/5" />
                <div className="h-10 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No matching requests found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any tickets matching your search query or filter selection. Try adjusting your filters or submit a new ticket.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Clear Filters
              </button>
              <Link
                to="/submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Submit New Request
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onQuickView={(request) => setQuickViewItem(request)}
              />
            ))}
          </div>
        )}

        {filteredRequests.length > 6 && (
          <div className="pt-4 text-center">
            <Link
              to="/requests"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 font-bold text-xs text-slate-700 hover:text-indigo-600 hover:border-indigo-300 shadow-xs transition-all"
            >
              <span>View All {filteredRequests.length} Requests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Quick View and Status Update Modals */}
      <QuickViewModal
        isOpen={Boolean(quickViewItem)}
        request={quickViewItem}
        onClose={() => setQuickViewItem(null)}
        onOpenStatusUpdate={(req) => setStatusUpdateItem(req)}
      />

      <StatusUpdateModal
        isOpen={Boolean(statusUpdateItem)}
        request={statusUpdateItem}
        onClose={() => setStatusUpdateItem(null)}
      />
    </div>
  );
};
