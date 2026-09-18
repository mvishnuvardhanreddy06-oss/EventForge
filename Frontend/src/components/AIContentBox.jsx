import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Edit3, ArrowRight, Sparkles } from 'lucide-react';

const AIContentBox = ({ content, onRegenerate, onUseContent, loading = false }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(content || '');

  React.useEffect(() => {
    setEditableText(content || '');
  }, [content]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content && !loading) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
        <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        Provide input parameters and click generate to create an AI draft.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-blue-200/80 shadow-md overflow-hidden">
      {/* Top action bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 px-5 py-3 border-b border-blue-100 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>AI Studio Draft (Review & Polish)</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
            title="Edit Draft"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
            title="Copy to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={loading}
              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
              title="Regenerate Draft"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
            Synthesizing professional copy with neural models...
          </div>
        ) : isEditing ? (
          <textarea
            rows="12"
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-mono"
          />
        ) : (
          <div className="prose prose-sm max-w-none text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {editableText}
          </div>
        )}
      </div>

      {/* Bottom Use Content bar */}
      {onUseContent && !loading && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Output is treated as a draft before final publication.
          </span>
          <button
            onClick={() => onUseContent(editableText)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-colors"
          >
            <span>Use Content</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AIContentBox;
