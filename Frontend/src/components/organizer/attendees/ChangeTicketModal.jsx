import React, { useState } from 'react';
import { X, Ticket, AlertCircle, ArrowRight, Check } from 'lucide-react';

const TICKET_TIERS = [
  { type: 'Student', price: 999, description: 'General hall access with student badge' },
  { type: 'Early Bird', price: 1999, description: 'All-access early bird conference pass' },
  { type: 'Standard', price: 2999, description: 'Standard delegate pass to keynotes and workshops' },
  { type: 'VIP', price: 4999, description: 'Full access + VIP lounge & networking dinner' },
  { type: 'Corporate', price: 7999, description: 'Enterprise delegation pass + 1-on-1 booth access' }
];

const ChangeTicketModal = ({
  isOpen,
  onClose,
  attendee,
  onConfirm
}) => {
  if (!isOpen || !attendee) return null;

  const currentTier = TICKET_TIERS.find((t) => t.type === attendee.ticketType) || {
    type: attendee.ticketType || 'Standard',
    price: typeof attendee.amountPaid === 'number' ? attendee.amountPaid : 2999
  };

  const [selectedTierType, setSelectedTierType] = useState(
    attendee.ticketType === 'VIP' ? 'Corporate' : 'VIP'
  );

  const selectedTier = TICKET_TIERS.find((t) => t.type === selectedTierType) || TICKET_TIERS[3];
  const priceDifference = selectedTier.price - currentTier.price;

  const handleUpdate = () => {
    onConfirm(attendee, selectedTierType, priceDifference);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 max-w-lg w-full overflow-hidden p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Change Ticket Tier
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Modify ticket class for {attendee.firstName} {attendee.lastName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current vs Proposed Comparison */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Pass</span>
            <p className="font-bold text-slate-900 text-sm">{currentTier.type}</p>
            <p className="font-mono text-slate-500 font-semibold">₹{currentTier.price.toLocaleString('en-IN')}</p>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-1">
            <span className="text-[10px] font-bold text-blue-600 uppercase block">Target Pass</span>
            <p className="font-bold text-blue-900 text-sm">{selectedTier.type}</p>
            <p className="font-mono text-blue-700 font-semibold">₹{selectedTier.price.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Tier Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">Select New Ticket Tier</label>
          <div className="grid grid-cols-1 gap-2">
            {TICKET_TIERS.map((tier) => (
              <label
                key={tier.type}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedTierType === tier.type
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="ticketTier"
                    value={tier.type}
                    checked={selectedTierType === tier.type}
                    onChange={() => setSelectedTierType(tier.type)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900">{tier.type}</span>
                    <p className="text-[10px] text-slate-500">{tier.description}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-slate-800">
                  ₹{tier.price.toLocaleString('en-IN')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Difference Advisory */}
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-bold">
            <span className="text-amber-900">
              {priceDifference >= 0 ? 'Additional amount:' : 'Refund credit due:'}
            </span>
            <span className="font-mono text-sm text-amber-950">
              ₹{Math.abs(priceDifference).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-start space-x-1.5 text-[11px] text-amber-800">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              Payment adjustment required. This action updates the attendee’s ticket tier badge; balance invoices or refund adjustments must be settled through the accounting workflow.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Update Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeTicketModal;
