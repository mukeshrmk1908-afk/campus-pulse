import React from 'react';
import { RequestPriority } from '../types';

interface PriorityBadgeProps {
  priority: RequestPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styles = {
    High: 'bg-rose-100/70 text-rose-700 border-rose-200',
    Medium: 'bg-amber-100/70 text-amber-800 border-amber-200',
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide border uppercase ${styles[priority] || styles.Medium}`}
    >
      {priority} Priority
    </span>
  );
};
