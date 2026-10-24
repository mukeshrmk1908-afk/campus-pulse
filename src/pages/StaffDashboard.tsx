import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import { StatusUpdateModal } from '../components/StatusUpdateModal';
import { QuickViewModal } from '../components/QuickViewModal';
import { CampusRequest, RequestStatus } from '../types';
import { formatDate, formatRelativeTime } from '../utils/dateUtils';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  ExternalLink,
  MessageSquare,
  Users,
  MapPin,
  Flame,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { requests, stats, activeRole, setActiveRole } = useRequests();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<CampusRequest | null>(null);
  const [quickViewTicket, setQuickViewTicket] = useState<CampusRequest | null>(null);

  // Active selected request in the side details panel (default to first matching item)
  const [panelTicketId, setPanelTicketId] = useState<string | null>(null);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        req.title.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q) ||
        req.location.toLowerCase().includes(q) ||
        req.contactName.toLowerCase().includes(q) ||
        (req.staffNotes && req.staffNotes.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const activePanelTicket = useMemo(() => {
    if (panelTicketId) {
      return requests.find((r) => r.id === panelTicketId) || null;
    }
    return filteredRequests[0] || null;
  }, [requests, panelTicketId, filteredRequests]);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Staff Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              Staff Administration Portal
            </span>
            <span className="text-xs text-slate-400">Campus Operations & Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Campus Triage & Management Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Review incoming student reports, update resolution workflows, and communicate live fix statuses directly back to the student body.
          </p>
        </div>

        {/* Quick Staff KPI Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 min-w-[100px] text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending</span>
            <span className="text-xl font-black text-rose-400">{stats.open}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 min-w-[100px] text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">In Progress</span>
            <span className="text-xl font-black text-indigo-300">{stats.inProgress}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 min-w-[100px] text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Resolved</span>
            <span className="text-xl font-black text-emerald-400">{stats.resolved}</span>
          </div>
        </div>
      </div>

      {/* Staff Action & Filter Controls */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID, name, location, or notes..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(['all', 'Open', 'In Progress', 'Resolved'] as (string | RequestStatus)[]).map((st) => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'All Issues' : st}
                <span className="ml-1.5 text-[10px] opacity-70">
                  (
                  {st === 'all'
                    ? requests.length
                    : requests.filter((r) => r.status === st).length}
                  )
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Staff Workplace: Left List + Right Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Ticket Management Table / Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900">
              Active Triage Queue ({filteredRequests.length})
            </h3>
            <span className="text-[11px] text-slate-500">
              Select any ticket to inspect or update
            </span>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-slate-500 text-xs">
              No tickets found matching the staff criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((req) => {
                const isSelected = activePanelTicket?.id === req.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => setPanelTicketId(req.id)}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md bg-indigo-50/20'
                        : 'border-slate-100 shadow-xs hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-600">
                          {req.id}
                        </span>
                        <CategoryBadge category={req.category} />
                      </div>
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={req.priority} />
                        <StatusBadge status={req.status} size="sm" />
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{req.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">{req.description}</p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-medium text-slate-700 truncate max-w-[150px]">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          {req.location}
                        </span>
                        <span>Rep: {req.contactName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(req);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Update Status</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Request Panel & Quick Action (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          {activePanelTicket ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {activePanelTicket.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                    {activePanelTicket.title}
                  </h3>
                </div>
                <StatusBadge status={activePanelTicket.status} size="md" />
              </div>

              {/* Status Update Quick Trigger */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Staff Workflow Action
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Last touched: {formatRelativeTime(activePanelTicket.updatedAt)}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedTicket(activePanelTicket)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Change Status / Add Action Note</span>
                </button>
              </div>

              {/* Ticket Details */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Description
                  </span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {activePanelTicket.description}
                  </p>
                </div>

                {activePanelTicket.staffNotes && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block mb-1">
                      Staff Resolution Log
                    </span>
                    <p className="text-indigo-950 leading-relaxed bg-indigo-50/70 p-3 rounded-xl border border-indigo-100">
                      {activePanelTicket.staffNotes}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Category
                    </span>
                    <span className="font-semibold text-slate-800">
                      {activePanelTicket.category}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Priority
                    </span>
                    <span className="font-semibold text-slate-800">
                      {activePanelTicket.priority} Priority
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Location
                    </span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {activePanelTicket.location}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Reporter
                    </span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {activePanelTicket.contactName}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Full Timeline Link */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setQuickViewTicket(activePanelTicket)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>Inspect Timeline ({activePanelTicket.timeline?.length || 0})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <Link
                  to={`/requests/${activePanelTicket.id}`}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Open Page &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-slate-400 text-xs">
              Select a ticket to view staff details
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <StatusUpdateModal
        isOpen={Boolean(selectedTicket)}
        request={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      <QuickViewModal
        isOpen={Boolean(quickViewTicket)}
        request={quickViewTicket}
        onClose={() => setQuickViewTicket(null)}
        onOpenStatusUpdate={(r) => setSelectedTicket(r)}
      />
    </div>
  );
};
