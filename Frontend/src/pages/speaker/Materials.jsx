import React, { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const Materials = () => {
  const [materials, setMaterials] = useState([
    { title: 'Keynote Deck - Autonomous Agent Architectures.pdf', size: '14.2 MB', date: 'Yesterday' }
  ]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Presentation Materials</h1>
        <p className="text-xs text-slate-500 mt-0.5">Upload PDF slide decks, workshop code repositories, and handouts.</p>
      </div>

      <div className="border-2 border-dashed border-blue-300 rounded-3xl p-8 bg-blue-50/40 text-center">
        <Upload className="w-10 h-10 text-blue-600 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-900">Upload Slide Presentation</h4>
        <p className="text-xs text-slate-500 mt-1 mb-4">PDF, PPTX, or Keynote up to 25MB</p>
        <button
          onClick={() => alert('File uploaded successfully in demo!')}
          className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
        >
          Choose File to Upload
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Uploaded Files</h4>
        {materials.map((m, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-2.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">{m.title}</p>
                <p className="text-[10px] text-slate-400">{m.size} • Uploaded {m.date}</p>
              </div>
            </div>
            <span className="text-xs text-emerald-600 font-bold">Synced</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Materials;
