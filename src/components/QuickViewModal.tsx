import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CampusRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { Timeline } from './Timeline';
import { formatDate } from '../utils/dateUtils';
import { useRequests } from '../context/RequestContext';
import {
  X,
  MapPin,
  User,
  Mail,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Edit3,
} from 'lucide-react';

interface QuickViewModalProps {
  request: CampusRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenStatusUpdate?: (request: CampusRequest) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  request,
  isOpen,
  onClose,
  onOpenStatusUpdate,
}) => {
  const { activeRole } = useRequests();
  const [activeTab, setActiveTab] = useState<'details' | 'timeline'>('details');

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded text-white">
                {request.id}
              </span>
              <CategoryBadge category={request.category} />
              <PriorityBadge priority={request.priority} />
              <StatusBadge status={request.status} />
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{request.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 px-6 border-b border-slate-100 bg-slate-50/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Issue Details
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Activity History</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {request.timeline?.length || 1}
            </span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          {activeTab === 'details' ? (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {request.description}
                </p>
              </div>

              {request.staffNotes && (
                <div>
                  <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    Latest Staff Resolution Update
                  </h4>
                  <div className="text-xs text-slate-700 bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 leading-relaxed">
                    {request.staffNotes}
                  </div>
                </div>
              )}

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    Location
                  </span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{request.location}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    Student Contact
                  </span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{request.contactName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{request.contactInfo}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    Date Submitted
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(request.createdAt)}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                    Assigned Handling Unit
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{request.assignedStaff || 'Campus Facilities Dispatch'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Timeline entries={request.timeline} />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <Link
            to={`/requests/${request.id}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            <span>Open Dedicated Ticket Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            {onOpenStatusUpdate && activeRole === 'staff' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenStatusUpdate(request);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Update Status</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
