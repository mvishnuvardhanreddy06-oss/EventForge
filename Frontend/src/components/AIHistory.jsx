import React from 'react';
import { Clock, Sparkles } from 'lucide-react';

const AIHistory = ({ history = [], onSelect }) => {
  if (history.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
        No generated history in this session yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item, idx) => (
        <div
          key={idx}
          onClick={() => onSelect && onSelect(item.text)}
          className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {item.type}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </span>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AIHistory;
