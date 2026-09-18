import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { num: '01', title: 'Basic Details' },
  { num: '02', title: 'Venue & Date' },
  { num: '03', title: 'Registration' },
  { num: '04', title: 'Sessions' },
  { num: '05', title: 'Speakers' },
  { num: '06', title: 'Sponsors' },
  { num: '07', title: 'Review & Publish' }
];

const EventStepper = ({ currentStep = 1, maxCompletedStep = 1, onStepClick }) => {
  const percentComplete = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Mobile/Compact Step Progress Header */}
      <div className="flex items-center justify-between text-xs sm:hidden pb-1 border-b border-slate-100">
        <span className="font-bold text-slate-800">
          Step {currentStep} of {STEPS.length} · {STEPS[currentStep - 1].title}
        </span>
        <span className="font-bold text-blue-600 font-mono">{percentComplete}% Complete</span>
      </div>

      {/* Progress Bar (Visible on all devices) */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.max(8, percentComplete)}%` }}
        />
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden sm:grid grid-cols-7 gap-2">
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep || stepNum <= maxCompletedStep;
          const isActive = stepNum === currentStep;
          const isAccessible = stepNum <= maxCompletedStep + 1;

          return (
            <button
              key={step.num}
              type="button"
              disabled={!isAccessible}
              onClick={() => isAccessible && onStepClick(stepNum)}
              className={`flex flex-col text-left p-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-50/80 border border-blue-200/80 ring-1 ring-blue-500/20'
                  : isAccessible
                  ? 'hover:bg-slate-50 cursor-pointer'
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    stepNum
                  )}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isActive ? 'text-blue-700' : 'text-slate-400'
                  }`}
                >
                  Step {step.num}
                </span>
              </div>
              <span
                className={`text-xs font-bold truncate leading-tight ${
                  isActive
                    ? 'text-slate-900'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EventStepper;
