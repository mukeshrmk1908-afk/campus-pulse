import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  badgeText?: string;
  badgeColor?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  gradient,
  badgeText,
  badgeColor,
  isActive = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative overflow-hidden rounded-2xl bg-white p-5 border transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''
      } ${
        isActive
          ? 'ring-2 ring-indigo-500 shadow-md border-indigo-200'
          : 'border-slate-100 shadow-xs hover:border-slate-200'
      }`}
    >
      {/* Decorative background glow circle */}
      <div
        className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full opacity-15 blur-xl pointer-events-none ${gradient}`}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
            {badgeText && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeColor || 'bg-slate-100 text-slate-600'}`}>
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
        </div>

        <div
          className={`p-3 rounded-xl shadow-xs text-white ${gradient} flex items-center justify-center transition-transform group-hover:scale-110 duration-200`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
