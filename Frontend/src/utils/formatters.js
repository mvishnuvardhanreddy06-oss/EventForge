export const formatDate = (dateString) => {
  if (!dateString) return 'TBA';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(dateString));
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'TBA';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const formatTime = (dateString) => {
  if (!dateString) return 'TBA';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export const getStatusBadgeColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'published':
    case 'confirmed':
    case 'approved':
    case 'completed':
    case 'active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'ongoing':
    case 'in_progress':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'pending':
    case 'waitlisted':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'cancelled':
    case 'rejected':
    case 'sold_out':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'draft':
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};
