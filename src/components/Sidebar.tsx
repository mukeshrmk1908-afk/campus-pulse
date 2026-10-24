import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  ShieldCheck,
  HelpCircle,
  PhoneCall,
  Clock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { stats, activeRole } = useRequests();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: null,
      highlight: false,
    },
    {
      to: '/submit',
      label: 'Report an Issue',
      icon: <PlusCircle className="w-4 h-4" />,
      badge: 'New',
      highlight: true,
    },
    {
      to: '/requests',
      label: 'My Requests',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: stats.total.toString(),
      highlight: false,
    },
    {
      to: '/staff',
      label: 'Staff Console',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: `${stats.open} Open`,
      highlight: activeRole === 'staff',
    },
    {
      to: '/faq',
      label: 'Campus Guide & FAQ',
      icon: <HelpCircle className="w-4 h-4" />,
      badge: null,
      highlight: false,
    },
  ];

  const content = (
    <div className="flex flex-col h-full justify-between p-4 bg-white/70 backdrop-blur-md border-r border-indigo-100/70">
      <div>
        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-xs border border-indigo-200/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <span className="text-indigo-600">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.label === 'Staff Console'
                      ? 'bg-rose-100 text-rose-700'
                      : item.highlight
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Live campus status card */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/40 border border-indigo-100/70">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Service Status
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Go
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Campus Helpdesk staff responds to high-priority safety & facility tickets within 2 hours.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-indigo-700">
            <span>Avg Response: 42 mins</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Emergency & Campus Support Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
          <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
            24/7 Security Hotline
          </p>
          <p className="text-xs font-mono font-bold text-slate-900 mt-1">
            ext. 4444 <span className="font-sans font-normal text-slate-500 text-[10px]">(+1-555-0199)</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            For medical or fire emergencies on campus
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-6.5rem)] sticky top-26 overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
