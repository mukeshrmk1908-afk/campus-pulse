import React from 'react';
import { TimelineEntry } from '../types';
import { formatDate } from '../utils/dateUtils';
import { CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';

interface TimelineProps {
  entries: TimelineEntry[];
}

export const Timeline: React.FC<TimelineProps> = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-slate-400">
        No status history recorded yet.
      </div>
    );
  }

  // Sort chronological order (oldest to newest)
  const sorted = [...entries].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {sorted.map((item, index) => {
        const isLast = index === sorted.length - 1;

        const iconConfig = {
          Open: {
            icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />,
            border: 'border-rose-400 bg-rose-50 ring-4 ring-rose-50',
          },
          'In Progress': {
            icon: <Clock className="w-3.5 h-3.5 text-indigo-600" />,
            border: 'border-indigo-400 bg-indigo-50 ring-4 ring-indigo-50',
          },
          Resolved: {
            icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
            border: 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-50',
          },
        }[item.status];

        return (
          <div key={item.id} className="relative group">
            {/* Timeline node icon */}
            <div
              className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${iconConfig.border} ${
                isLast ? 'shadow-xs' : ''
              }`}
            >
              {iconConfig.icon}
            </div>

            <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Status set to <span className="underline decoration-indigo-300">{item.status}</span>
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    by {item.updatedBy}
                  </span>
                </div>
                <time className="text-[11px] font-medium text-slate-400">
                  {formatDate(item.timestamp)}
                </time>
              </div>

              {item.note && (
                <div className="mt-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 flex items-start gap-2 leading-relaxed">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{item.note}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
