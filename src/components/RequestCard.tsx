import React from 'react';
import { Link } from 'react-router-dom';
import { CampusRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { formatRelativeTime, formatDate } from '../utils/dateUtils';
import { MapPin, User, Calendar, ArrowRight, Clock } from 'lucide-react';

interface RequestCardProps {
  request: CampusRequest;
  onQuickView?: (request: CampusRequest) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onQuickView }) => {
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-lg hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Header row: ID + Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-md border border-indigo-100/80">
              {request.id}
            </span>
            <CategoryBadge category={request.category} />
          </div>

          <div className="flex items-center gap-2">
            <PriorityBadge priority={request.priority} />
            <StatusBadge status={request.status} />
          </div>
        </div>

        {/* Title */}
        <Link
          to={`/requests/${request.id}`}
          className="block group-hover:text-indigo-600 transition-colors"
        >
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
            {request.title}
          </h3>
        </Link>

        {/* Description preview */}
        <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {request.description}
        </p>

        {/* Meta details: Location & Contact */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate font-medium">{request.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate text-slate-600">
            <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{request.contactName}</span>
          </div>
        </div>
      </div>

      {/* Footer row: Timestamps & View link */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" title={`Created: ${formatDate(request.createdAt)}`}>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formatRelativeTime(request.createdAt)}
          </span>
          <span className="hidden sm:flex items-center gap-1" title={`Updated: ${formatDate(request.updatedAt)}`}>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Upd: {formatRelativeTime(request.updatedAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(request)}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-2 py-1 rounded hover:bg-slate-50 transition-colors"
            >
              Quick Peek
            </button>
          )}
          <Link
            to={`/requests/${request.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
