import React, { useState } from 'react';
import { Upload, Image, FileText, CheckCircle } from 'lucide-react';

const BrandAssets = () => {
  const [assets, setAssets] = useState([
    { name: 'Corporate Vector Logo (Dark).svg', type: 'Vector Logo', date: 'Yesterday' },
    { name: 'Executive Keynote Slide Template.pptx', type: 'Presentation Deck', date: '3 days ago' },
    { name: 'Digital Swag Voucher Flyer.pdf', type: 'Marketing Collateral', date: '1 week ago' }
  ]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Brand Assets & Media Collateral</h1>
        <p className="text-xs text-slate-500 mt-0.5">Upload official company logos, exhibition banners, and digital attendee bag inserts.</p>
      </div>

      <div className="border-2 border-dashed border-blue-300 rounded-3xl p-8 bg-blue-50/40 text-center">
        <Upload className="w-10 h-10 text-blue-600 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-900">Upload Brand Vector or Media Kit</h4>
        <p className="text-xs text-slate-500 mt-1 mb-4">SVG, PNG, PDF, or ZIP up to 20MB</p>
        <button
          onClick={() => alert('Brand asset uploaded and synchronized with conference organizer!')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          Select File to Upload
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Uploaded Deliverables</h3>
        <div className="space-y-3">
          {assets.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900">{item.name}</p>
                  <p className="text-[11px] text-slate-400">{item.type} • Uploaded {item.date}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified by Staff
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandAssets;
