import React from 'react';
import { RequestCategory } from '../types';
import {
  Zap,
  Droplets,
  Wifi,
  GraduationCap,
  Sparkles,
  Building2,
  Bus,
  Utensils,
  HelpCircle,
} from 'lucide-react';

interface CategoryBadgeProps {
  category: RequestCategory;
  showIconOnly?: boolean;
}

export const getCategoryConfig = (category: RequestCategory) => {
  switch (category) {
    case 'Electrical':
      return {
        icon: <Zap className="w-3.5 h-3.5" />,
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'Plumbing':
      return {
        icon: <Droplets className="w-3.5 h-3.5" />,
        color: 'text-sky-700 bg-sky-50 border-sky-200',
        dot: 'bg-sky-500',
      };
    case 'Wi-Fi / Internet':
      return {
        icon: <Wifi className="w-3.5 h-3.5" />,
        color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        dot: 'bg-indigo-500',
      };
    case 'Classroom / Laboratory':
      return {
        icon: <GraduationCap className="w-3.5 h-3.5" />,
        color: 'text-purple-700 bg-purple-50 border-purple-200',
        dot: 'bg-purple-500',
      };
    case 'Cleaning and Maintenance':
      return {
        icon: <Sparkles className="w-3.5 h-3.5" />,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'Hostel':
      return {
        icon: <Building2 className="w-3.5 h-3.5" />,
        color: 'text-orange-700 bg-orange-50 border-orange-200',
        dot: 'bg-orange-500',
      };
    case 'Transport':
      return {
        icon: <Bus className="w-3.5 h-3.5" />,
        color: 'text-pink-700 bg-pink-50 border-pink-200',
        dot: 'bg-pink-500',
      };
    case 'Canteen':
      return {
        icon: <Utensils className="w-3.5 h-3.5" />,
        color: 'text-yellow-800 bg-yellow-50 border-yellow-200',
        dot: 'bg-yellow-500',
      };
    case 'Other':
    default:
      return {
        icon: <HelpCircle className="w-3.5 h-3.5" />,
        color: 'text-slate-700 bg-slate-100 border-slate-200',
        dot: 'bg-slate-400',
      };
  }
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, showIconOnly = false }) => {
  const config = getCategoryConfig(category);

  if (showIconOnly) {
    return (
      <span
        title={category}
        className={`inline-flex items-center justify-center p-2 rounded-lg border ${config.color}`}
      >
        {config.icon}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.color}`}
    >
      {config.icon}
      <span>{category}</span>
    </span>
  );
};
