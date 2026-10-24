import React from 'react';
import { RequestStatus } from '../types';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs = {
    Open: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500 animate-pulse',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    'In Progress': {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      dot: 'bg-indigo-500 animate-pulse',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    Resolved: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[status] || configs.Open;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs transition-colors duration-200 ${sizeClasses[size]} ${config.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{status}</span>
    </span>
  );
};
