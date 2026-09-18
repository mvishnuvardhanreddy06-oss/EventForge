import React, { useState } from 'react';
import { Server, Database, Activity, HardDrive, RefreshCw, CheckCircle2 } from 'lucide-react';
import SettingCard from './SettingCard';

const SystemSettings = ({ lastSystemCheck, onRunSystemCheck, onSave }) => {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      onRunSystemCheck();
    }, 600);
  };

  return (
    <div className="space-y-6">
      <SettingCard
        title="System Settings"
        subtitle="Infrastructure health, database cluster connection and cluster telemetry"
        actionButton={
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Checking...' : 'Run System Check'}</span>
          </button>
        }
      >
        <div className="space-y-4 text-xs">
          {/* Version & Environment Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Platform Version
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                v1.0.0 (Build 2026.09-prod)
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Environment
              </span>
              <span className="font-semibold text-emerald-700 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Production Tier</span>
              </span>
            </div>
          </div>

          {/* Health Status Matrix */}
          <div className="border border-slate-200/80 rounded-xl divide-y divide-slate-100 overflow-hidden">
            <div className="p-3.5 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
                  <Database className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Database Status</span>
                  <span className="text-[11px] text-slate-500">MongoDB Atlas Cluster (Primary Replica Active)</span>
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span>● Connected</span>
              </span>
            </div>

            <div className="p-3.5 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">API Status</span>
                  <span className="text-[11px] text-slate-500">Express REST Gateway & Real-Time Socket.IO</span>
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                <span>● Operational</span>
              </span>
            </div>

            <div className="p-3.5 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200/60">
                  <HardDrive className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Storage Status</span>
                  <span className="text-[11px] text-slate-500">Encrypted AWS S3 Bucket (18% quota utilized)</span>
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span>● Available</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
            <span>Last System Health Check:</span>
            <span className="font-mono font-semibold text-slate-700">{lastSystemCheck}</span>
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

export default SystemSettings;
