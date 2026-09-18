import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import Badge from './Badge';

const TicketCard = ({ ticket, onSelect, isSelected = false, isSoldOut = false }) => {
  return (
    <div className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
      isSelected
        ? 'border-blue-600 bg-blue-50/40 shadow-md ring-2 ring-blue-600/20'
        : isSoldOut
        ? 'border-slate-200 bg-slate-50/60 opacity-70'
        : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
    }`}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-base font-bold text-slate-900">{ticket.name}</h4>
          <Badge status={ticket.remaining === 0 ? 'sold_out' : ticket.status} />
        </div>

        <div className="mb-4">
          <span className="text-2xl font-black text-slate-900">
            {ticket.price === 0 ? 'Free' : formatCurrency(ticket.price)}
          </span>
          <span className="text-xs text-slate-400 font-medium ml-1.5">/ attendee</span>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          {ticket.description}
        </p>

        <ul className="space-y-2 mb-6">
          {(ticket.benefits || []).map((benefit, idx) => (
            <li key={idx} className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-500">
          {ticket.remaining > 0 ? (
            <span><strong className="text-slate-800">{ticket.remaining}</strong> passes left</span>
          ) : (
            <span className="text-rose-600 font-bold">Sold Out</span>
          )}
        </div>

        {onSelect && !isSoldOut && (
          <button
            onClick={() => onSelect(ticket)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isSelected
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            {isSelected ? 'Selected' : 'Select Tier'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
