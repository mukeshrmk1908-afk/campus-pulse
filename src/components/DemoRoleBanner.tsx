import React from 'react';
import { useRequests } from '../context/RequestContext';
import { Shield, GraduationCap, ArrowLeftRight, Database, HardDrive, RotateCcw } from 'lucide-react';

export const DemoRoleBanner: React.FC = () => {
  const { activeRole, setActiveRole, storageMode, resetToDemo } = useRequests();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs px-4 py-2.5 sm:px-6 shadow-sm border-b border-indigo-900/50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left message & storage badge */}
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Evaluation Demo Mode
          </span>
          <span className="text-slate-300 hidden md:inline">
            Toggle between student submission mode and staff triage console.
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            {storageMode === 'supabase' ? (
              <>
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Supabase Live</span>
              </>
            ) : (
              <>
                <HardDrive className="w-3 h-3 text-amber-400" />
                <span>localStorage Active</span>
              </>
            )}
          </span>
        </div>

        {/* Right Switcher & Reset */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center bg-white/10 p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveRole('student')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                activeRole === 'student'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student View</span>
            </button>
            <button
              onClick={() => setActiveRole('staff')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                activeRole === 'staff'
                  ? 'bg-gradient-to-r from-coral-500 via-rose-500 to-pink-600 bg-rose-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Staff Console</span>
            </button>
          </div>

          <button
            onClick={resetToDemo}
            title="Reset tickets to initial demo seed data"
            className="flex items-center gap-1 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors text-[11px] font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Seeds</span>
          </button>
        </div>
      </div>
    </div>
  );
};
