import React from 'react';

const CheckInStatusBadge = ({
  checkedIn = false,
  checkInTime = null,
  checkInDate = null,
  showTime = true,
  className = ''
}) => {
  if (checkedIn) {
    return (
      <div className={`space-y-0.5 ${className}`}>
        <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>Checked In</span>
        </span>
        {showTime && (checkInTime || checkInDate) && (
          <p className="text-[10px] text-slate-500 font-medium pl-0.5">
            {checkInTime && <span className="font-semibold text-slate-700">{checkInTime}</span>}
            {checkInTime && checkInDate && <span> · </span>}
            {checkInDate && <span>{checkInDate}</span>}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-0.5 ${className}`}>
      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200/80 shrink-0 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
        <span>Not Checked In</span>
      </span>
    </div>
  );
};

export default CheckInStatusBadge;
