import React from 'react';
import AIGenerator from '../../components/AIGenerator';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

const AIStudio = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center space-x-2 text-blue-600 mb-1">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">EventForge Neural Engine</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Content Studio</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Draft compelling descriptions, speaker biographies, session overviews, announcements, and promotional copy.
        </p>
      </div>

      <AIGenerator />
    </div>
  );
};

export default AIStudio;
