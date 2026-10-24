import React, { useState } from 'react';
import { CampusRequest, RequestStatus } from '../types';
import { useRequests } from '../context/RequestContext';
import { X, CheckCircle2, Clock, AlertCircle, Send, ShieldCheck } from 'lucide-react';

interface StatusUpdateModalProps {
  request: CampusRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  const { updateStatus } = useRequests();
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>(
    request?.status || 'In Progress'
  );
  const [staffName, setStaffName] = useState('Campus Ops Team');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when request changes
  React.useEffect(() => {
    if (request) {
      setSelectedStatus(request.status);
      setStaffName(request.assignedStaff || 'Campus Ops Team');
      setNote('');
    }
  }, [request]);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateStatus(
        request.id,
        selectedStatus,
        staffName.trim() || 'Campus Staff Specialist',
        note.trim() || undefined
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Update Request Status</h3>
              <p className="text-xs text-indigo-200 font-mono">Ticket #{request.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Issue Brief */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-xs">
            <span className="font-semibold text-slate-800 line-clamp-1">{request.title}</span>
            <div className="text-slate-500 mt-1 flex items-center gap-2">
              <span>{request.category}</span>
              <span>•</span>
              <span>{request.location}</span>
            </div>
          </div>

          {/* Status Selection (exactly Open, In Progress, Resolved) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              New Status <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Open', 'In Progress', 'Resolved'] as RequestStatus[]).map((status) => {
                const isSelected = selectedStatus === status;
                const statusTheme = {
                  Open: 'hover:border-rose-300 text-rose-700 border-rose-200 bg-rose-50/50',
                  'In Progress': 'hover:border-indigo-300 text-indigo-700 border-indigo-200 bg-indigo-50/50',
                  Resolved: 'hover:border-emerald-300 text-emerald-800 border-emerald-200 bg-emerald-50/50',
                }[status];

                const activeTheme = {
                  Open: 'ring-2 ring-rose-500 bg-rose-50 border-rose-400 font-bold',
                  'In Progress': 'ring-2 ring-indigo-500 bg-indigo-50 border-indigo-400 font-bold',
                  Resolved: 'ring-2 ring-emerald-500 bg-emerald-50 border-emerald-500 font-bold',
                }[status];

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs transition-all ${
                      isSelected ? activeTheme : statusTheme
                    }`}
                  >
                    {status === 'Open' && <AlertCircle className="w-4 h-4 mb-1 text-rose-600" />}
                    {status === 'In Progress' && <Clock className="w-4 h-4 mb-1 text-indigo-600" />}
                    {status === 'Resolved' && <CheckCircle2 className="w-4 h-4 mb-1 text-emerald-600" />}
                    <span>{status}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Staff Member Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Responding Staff / Department
            </label>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="e.g. Campus IT Helpdesk, Electrical Dept."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Resolution / Progress Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Action Notes / Resolution Details
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Explain the actions taken, dispatched parts, or student instructions..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Status</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
