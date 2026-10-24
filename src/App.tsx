import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { RequestProvider } from './context/RequestContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DemoRoleBanner } from './components/DemoRoleBanner';

import { Dashboard } from './pages/Dashboard';
import { SubmitRequest } from './pages/SubmitRequest';
import { MyRequests } from './pages/MyRequests';
import { StaffDashboard } from './pages/StaffDashboard';
import { RequestDetails } from './pages/RequestDetails';
import { CampusFAQ } from './pages/CampusFAQ';

function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fe]">
      {/* Demo Role Switcher & Assessment Helper Banner */}
      <DemoRoleBanner />

      {/* Main Top Navigation */}
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      {/* Layout with Sidebar & Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex gap-8">
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/submit" element={<SubmitRequest />} />
            <Route path="/requests" element={<MyRequests />} />
            <Route path="/requests/:id" element={<RequestDetails />} />
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/faq" element={<CampusFAQ />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Modern Footer */}
      <footer className="mt-auto border-t border-slate-200/70 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CampusPulse</span>
            <span>—</span>
            <span>Campus Incident & Helpdesk Management System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>React &bull; Tailwind CSS &bull; LocalStorage / Supabase Ready</span>
            <span>Built for Campus Assessment</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <RequestProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </RequestProvider>
    </ToastProvider>
  );
}
