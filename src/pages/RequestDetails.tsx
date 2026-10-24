import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import { Timeline } from '../components/Timeline';
import { StatusUpdateModal } from '../components/StatusUpdateModal';
import { formatDate, formatRelativeTime } from '../utils/dateUtils';
import {
  ArrowLeft,
  MapPin,
  User,
  Mail,
  Calendar,
  Clock,
  Printer,
  Copy,
  Check,
  Edit3,
  ShieldAlert,
  HelpCircle,
  Share2,
} from 'lucide-react';

export const RequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { requests, activeRole } = useRequests();
  const navigate = useNavigate();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const request = requests.find((r) => r.id.toLowerCase() === id?.toLowerCase());

  if (!request) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Ticket Not Found</h2>
        <p className="text-xs text-slate-500">
          The request ID <span className="font-mono font-bold text-slate-700">"{id}"</span> does
          not exist or has been removed.
        </p>
        <Link
          to="/requests"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse All Requests</span>
        </Link>
      </div>
    );
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(request.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Ticket ID</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-xs"
            title="Print Ticket Receipt"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Receipt</span>
          </button>

          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update Status</span>
          </button>
        </div>
      </div>

      {/* Main Ticket Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Ticket Header Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-bold bg-white/20 px-3 py-1 rounded-md text-white">
                {request.id}
              </span>
              <CategoryBadge category={request.category} />
              <PriorityBadge priority={request.priority} />
            </div>

            <StatusBadge status={request.status} size="lg" />
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
            {request.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Submitted {formatDate(request.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Last activity {formatRelativeTime(request.updatedAt)}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Issue Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Detailed Issue Explanation
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 whitespace-pre-wrap">
              {request.description}
            </p>
          </div>

          {/* Latest Staff Resolution Update (if any) */}
          {request.staffNotes && (
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  Official Staff Response / Fix Note
                </span>
                <span className="text-[11px] font-medium text-indigo-500">
                  By {request.assignedStaff || 'Campus Facility Management'}
                </span>
              </div>
              <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                {request.staffNotes}
              </p>
            </div>
          )}

          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                Location
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{request.location}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                Student Reporter
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>{request.contactName}</span>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{request.contactInfo}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                Responsible Unit
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{request.assignedStaff || 'Campus Maintenance Dispatch'}</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline Section */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Activity History & Status Timeline</h3>
                <p className="text-xs text-slate-500">
                  Complete audit trail of every status transition and technician comment.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {request.timeline?.length || 1} Events
              </span>
            </div>

            <Timeline entries={request.timeline} />
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={isUpdateModalOpen}
        request={request}
        onClose={() => setIsUpdateModalOpen(false)}
      />
    </div>
  );
};
