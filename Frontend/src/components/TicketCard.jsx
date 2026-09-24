import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import Badge from './Badge';

const TicketCard = ({ ticket, onSelect, isSelected = false, isSoldOut = false }) => {
  return (
    <div className={`panel flex flex-col justify-between transition-all ${
      isSelected
        ? 'border-accent bg-accent/5 ring-2 ring-accent/30 shadow-md'
        : isSoldOut
        ? 'opacity-60 bg-bg'
        : 'hover:border-accent/40'
    }`}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-base font-display font-bold text-ink">{ticket.name}</h4>
          <Badge status={ticket.remaining === 0 ? 'sold_out' : ticket.status} />
        </div>

        <div className="mb-4">
          <span className="text-2xl font-display font-bold text-ink">
            {ticket.price === 0 ? 'Free' : formatCurrency(ticket.price)}
          </span>
          <span className="text-xs text-muted font-medium ml-1.5">/ attendee</span>
        </div>

        <p className="text-xs text-muted mb-4 leading-relaxed">
          {ticket.description}
        </p>

        <ul className="space-y-2 mb-6">
          {(ticket.benefits || []).map((benefit, idx) => (
            <li key={idx} className="flex items-center space-x-2 text-xs text-muted font-medium">
              <Check className="w-3.5 h-3.5 text-teal shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-line flex items-center justify-between">
        <div className="text-xs font-semibold text-muted">
          {ticket.remaining > 0 ? (
            <span><strong className="text-ink">{ticket.remaining}</strong> passes left</span>
          ) : (
            <span className="text-accent font-bold">Sold Out</span>
          )}
        </div>

        {onSelect && !isSoldOut && (
          <button
            onClick={() => onSelect(ticket)}
            className={`!py-2 !px-4 text-xs font-bold transition-all cursor-pointer ${
              isSelected ? 'btn-primary' : 'btn'
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
