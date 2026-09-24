import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return document.documentElement.classList.contains('dark');
    } catch {
      return false;
    }
  });

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    try {
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col justify-between py-6 px-4 relative overflow-x-hidden font-sans transition-colors duration-200">
      {/* Top Bar with Brand & Theme Toggle */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-ink hover:opacity-90 transition-opacity">
          <i className="h-[22px] w-[22px] rounded-[7px_7px_7px_2px] bg-accent inline-block"></i>
          <span>EventForge</span>
        </Link>
        <button
          onClick={toggleTheme}
          type="button"
          className="btn text-xs font-semibold px-2.5 py-1.5"
          aria-label="Switch color theme"
        >
          {isDark ? <span>☀ Light</span> : <span>☾ Dark</span>}
        </button>
      </div>

      {/* Centered Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-center my-auto py-6">
        <Outlet />
      </main>

      {/* Global Auth Screen Footer */}
      <footer className="text-center mt-6 text-xs text-muted space-y-1 select-none">
        <p className="font-semibold text-ink">© 2026 EventForge</p>
        <p className="text-[11px] text-muted">All-in-one event management platform for conferences &amp; summits</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
