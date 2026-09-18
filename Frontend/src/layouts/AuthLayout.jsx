import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-8 sm:py-12 px-4 relative overflow-x-hidden font-sans text-slate-900">
      {/* Subtle Background Gradients & Ambient Shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/70 via-slate-100/30 to-transparent pointer-events-none -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-50/50 blur-3xl pointer-events-none -z-10" />

      {/* Centered Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-center my-auto">
        <Outlet />
      </main>

      {/* Global Auth Screen Footer */}
      <footer className="text-center mt-8 text-xs text-slate-400 space-y-1 select-none">
        <p className="font-semibold text-slate-500">© 2026 EventForge</p>
        <p className="text-[11px]">Enterprise Event &amp; Conference Management Platform</p>
        <div className="flex items-center justify-center space-x-3 text-[11px] text-slate-400 pt-1">
          <span className="hover:text-slate-600 cursor-pointer transition-colors">Terms</span>
          <span>•</span>
          <span className="hover:text-slate-600 cursor-pointer transition-colors">Privacy</span>
          <span>•</span>
          <span className="hover:text-slate-600 cursor-pointer transition-colors">Security</span>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
