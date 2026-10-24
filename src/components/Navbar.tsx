import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import {
  LifeBuoy,
  PlusCircle,
  Menu,
  X,
  Bell,
  Search,
  CheckCircle,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  onSearchFocus?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  isMobileMenuOpen,
}) => {
  const { stats, activeRole } = useRequests();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-indigo-100/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <LifeBuoy className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                  CampusPulse
                </span>
                <span className="text-[10px] -mt-1 font-semibold uppercase tracking-wider text-slate-400">
                  Campus Helpdesk
                </span>
              </div>
            </Link>
          </div>

          {/* Center search shortcut indicator / quick stat preview */}
          <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Live Campus Status
            </span>
            <span className="h-3 w-px bg-slate-200" />
            <span className="text-rose-600 font-semibold">{stats.open} Open</span>
            <span className="text-slate-300">•</span>
            <span className="text-indigo-600 font-semibold">{stats.inProgress} In Progress</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-600 font-semibold">{stats.resolved} Resolved</span>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Quick Track Link */}
            <Link
              to="/requests"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <span>Track Requests</span>
              {stats.open > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center justify-center">
                  {stats.open}
                </span>
              )}
            </Link>

            {/* Staff shortcut badge */}
            {activeRole === 'staff' && (
              <Link
                to="/staff"
                className="hidden sm:flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl hover:bg-rose-100 transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Staff Console</span>
              </Link>
            )}

            {/* Prominent "Report an Issue" button */}
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report an Issue</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
