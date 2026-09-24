import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Circle,
  CheckCircle2,
  Check
} from 'lucide-react';

const AlertCard = () => {
  const [reviewedItems, setReviewedItems] = useState({});
  const [feedback, setFeedback] = useState(null);

  const handleReview = (id, message) => {
    setReviewedItems((prev) => ({ ...prev, [id]: true }));
    setFeedback(message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const alerts = [
    {
      id: 'org-approval',
      title: 'Organizations awaiting approval',
      subtitle: '2 organizations require review',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      actionText: 'Review'
    },
    {
      id: 'sub-expiry',
      title: 'Subscriptions expiring soon',
      subtitle: '3 enterprise renewals',
      icon: Clock,
      iconColor: 'text-blue-500',
      actionText: 'Review'
    },
    {
      id: 'user-review',
      title: 'Users require review',
      subtitle: '5 accounts require attention',
      icon: Circle,
      iconColor: 'text-slate-400',
      actionText: 'Review'
    },
    {
      id: 'sec-status',
      title: 'System healthy',
      subtitle: 'No critical security issues',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      actionText: null
    }
  ];

  return (
    <div className="panel flex flex-col justify-between h-full min-w-0 overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4 min-w-0">
          <div className="min-w-0">
            <h3 className="text-base font-display font-bold text-ink tracking-tight truncate">
              Alerts & Actions
            </h3>
            <p className="text-xs text-muted mt-0.5 truncate">
              Platform security and verification items
            </p>
          </div>
        </div>

        {feedback && (
          <div className="mb-3 px-3 py-2 bg-teal/10 border border-teal/20 rounded-lg text-xs text-teal font-medium flex items-center justify-between animate-fade-in min-w-0">
            <span className="truncate mr-2">{feedback}</span>
            <Check className="w-3.5 h-3.5 text-teal shrink-0" />
          </div>
        )}

        <div className="space-y-2.5">
          {alerts.map((item) => {
            const Icon = item.icon;
            const isReviewed = reviewedItems[item.id];

            return (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-line bg-bg/40 hover:bg-bg/80 transition-colors flex items-center justify-between gap-3 min-w-0"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <Icon className={`w-4 h-4 shrink-0 ${item.iconColor}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-ink truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-muted truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {item.actionText ? (
                  <button
                    onClick={() =>
                      handleReview(
                        item.id,
                        `Acknowledged: ${item.title} queued for admin verification`
                      )
                    }
                    disabled={isReviewed}
                    className={`btn !py-1 !px-2.5 text-xs font-semibold shrink-0 cursor-pointer ${
                      isReviewed
                        ? 'opacity-50 cursor-default'
                        : ''
                    }`}
                  >
                    {isReviewed ? 'Done' : item.actionText}
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-teal shrink-0 px-2 py-0.5 bg-teal/10 rounded">
                    Healthy
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-line flex items-center justify-between text-xs text-muted">
        <span className="truncate">Platform status: Operational</span>
        <button
          onClick={() => handleReview('all', 'All platform security alerts reviewed.')}
          className="font-semibold text-accent hover:underline shrink-0 cursor-pointer"
        >
          View Alerts
        </button>
      </div>
    </div>
  );
};

export default AlertCard;
