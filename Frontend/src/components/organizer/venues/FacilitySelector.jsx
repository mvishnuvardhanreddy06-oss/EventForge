import React, { useState } from 'react';
import {
  Wifi,
  Car,
  Utensils,
  Projector,
  Tv,
  Volume2,
  Sparkles,
  Accessibility,
  Shield,
  Camera,
  Radio,
  Zap,
  Plus,
  X,
  Check
} from 'lucide-react';

const STANDARD_FACILITIES = [
  { name: 'Wi-Fi', icon: Wifi },
  { name: 'Parking', icon: Car },
  { name: 'Catering', icon: Utensils },
  { name: 'Projector', icon: Projector },
  { name: 'LED Screens', icon: Tv },
  { name: 'Audio / PA System', icon: Volume2 },
  { name: 'Stage', icon: Sparkles },
  { name: 'Accessibility', icon: Accessibility },
  { name: 'Security', icon: Shield },
  { name: 'Photography', icon: Camera },
  { name: 'Live Streaming', icon: Radio },
  { name: 'Backup Power', icon: Zap }
];

const FacilitySelector = ({ selectedFacilities = [], onChange }) => {
  const [customInput, setCustomInput] = useState('');

  const toggleFacility = (facilityName) => {
    if (selectedFacilities.includes(facilityName)) {
      onChange(selectedFacilities.filter((f) => f !== facilityName));
    } else {
      onChange([...selectedFacilities, facilityName]);
    }
  };

  const handleAddCustom = (e) => {
    e?.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!selectedFacilities.includes(trimmed)) {
      onChange([...selectedFacilities, trimmed]);
    }
    setCustomInput('');
  };

  const handleRemoveCustom = (facilityName) => {
    onChange(selectedFacilities.filter((f) => f !== facilityName));
  };

  // Find any selected facilities not in the standard list
  const standardNames = STANDARD_FACILITIES.map((f) => f.name);
  const customSelected = selectedFacilities.filter((f) => !standardNames.includes(f));

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Available Facilities & Amenities
        </label>
        <p className="text-[11px] text-slate-400">
          Select all amenities provided by this venue or add custom provisions.
        </p>
      </div>

      {/* Standard Facilities Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {STANDARD_FACILITIES.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedFacilities.includes(item.name);

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => toggleFacility(item.name)}
              className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
                isSelected
                  ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-2xs ring-1 ring-blue-500/20'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${
                  isSelected ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Added Facilities Pills */}
      {customSelected.length > 0 && (
        <div className="pt-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Custom Facilities ({customSelected.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {customSelected.map((fac) => (
              <span
                key={fac}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200"
              >
                <span>{fac}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCustom(fac)}
                  className="text-blue-500 hover:text-blue-800 rounded-md p-0.5 hover:bg-blue-100 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Facility Input */}
      <div className="flex items-center space-x-2 pt-1">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCustom();
            }
          }}
          placeholder="e.g. VIP Green Room, Translator Booths..."
          className="flex-1 px-3 py-1.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Facility</span>
        </button>
      </div>
    </div>
  );
};

export default FacilitySelector;
