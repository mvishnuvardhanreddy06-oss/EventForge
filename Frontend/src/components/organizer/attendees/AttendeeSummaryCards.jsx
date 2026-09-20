import React from 'react';
import { Users, CheckCircle2, Clock, QrCode, CreditCard, ArrowUpRight } from 'lucide-react';

const AttendeeSummaryCards = ({ stats, activeFilter, onFilterChange }) => {
  const cards = [
    {
      id: 'total',
      title: 'TOTAL REGISTERED',
      value: typeof stats?.total === 'number' ? stats.total.toLocaleString('en-IN') : (stats?.total || '1,240'),
      icon: Users,
      trend: '+14% this week',
      subtext: 'Across managed events',
      bgClass: 'bg-slate-50 border-slate-200 text-slate-700',
      colorClass: 'text-slate-900',
      filterType: 'registrationStatus',
      filterValue: 'all'
    },
    {
      id: 'confirmed',
      title: 'CONFIRMED',
      value: typeof stats?.confirmed === 'number' ? stats.confirmed.toLocaleString('en-IN') : (stats?.confirmed || '1,180'),
      icon: CheckCircle2,
      trend: '95.2% confirmed',
      subtext: 'Valid ticket holders',
      bgClass: 'bg-emerald-50/80 border-emerald-200 text-emerald-700',
      colorClass: 'text-emerald-700',
      filterType: 'registrationStatus',
      filterValue: 'confirmed'
    },
    {
      id: 'pending',
      title: 'PENDING APPROVAL',
      value: typeof stats?.pending === 'number' ? stats.pending.toLocaleString('en-IN') : (stats?.pending || '35'),
      icon: Clock,
      trend: 'Awaiting review',
      subtext: 'Requires organizer action',
      bgClass: 'bg-amber-50/80 border-amber-200 text-amber-700',
      colorClass: 'text-amber-700',
      filterType: 'registrationStatus',
      filterValue: 'pending'
    },
    {
      id: 'checkedIn',
      title: 'CHECKED IN',
      value: typeof stats?.checkedIn === 'number' ? stats.checkedIn.toLocaleString('en-IN') : (stats?.checkedIn || '860'),
      icon: QrCode,
      trend: '69.4% present',
      subtext: 'Badges scanned onsite',
      bgClass: 'bg-blue-50/80 border-blue-200 text-blue-700',
      colorClass: 'text-blue-700',
      filterType: 'checkInStatus',
      filterValue: 'checked_in'
    },
    {
      id: 'paymentsPending',
      title: 'PAYMENTS PENDING',
      value: stats?.paymentsPendingFormatted || (typeof stats?.paymentsPending === 'number' ? `₹${stats.paymentsPending.toLocaleString('en-IN')}` : '₹1,25,000'),
      icon: CreditCard,
      trend: '28 transactions',
      subtext: 'Follow-up reminders sent',
      bgClass: 'bg-rose-50/80 border-rose-200 text-rose-700',
      colorClass: 'text-rose-700',
      filterType: 'paymentStatus',
      filterValue: 'pending'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isClickable = Boolean(card.filterValue);
        const isActive = activeFilter === card.filterValue;

        return (
          <div
            key={card.id}
            onClick={() => isClickable && onFilterChange?.(card.filterType, card.filterValue)}
            className={`bg-white rounded-2xl border p-4 shadow-2xs transition-all duration-200 ${
              isClickable ? 'cursor-pointer hover:shadow-xs hover:border-slate-300' : ''
            } ${
              isActive
                ? 'ring-2 ring-blue-600 border-blue-300 shadow-xs'
                : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-xl border ${card.bgClass}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline justify-between">
              <span className={`text-2xl font-black tracking-tight ${card.colorClass}`}>
                {card.value}
              </span>
              {card.trend && (
                <span className="inline-flex items-center text-[10px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-200/60">
                  {card.trend}
                </span>
              )}
            </div>

            <p className="text-[10px] text-slate-400 mt-1 truncate">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default AttendeeSummaryCards;
