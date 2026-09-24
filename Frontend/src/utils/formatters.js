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
      return 'bg-teal/10 text-teal border-teal/20';
    case 'ongoing':
    case 'in_progress':
      return 'bg-accent/10 text-accent border-accent/20';
    case 'pending':
    case 'waitlisted':
      return 'bg-gold/10 text-gold border-gold/20';
    case 'cancelled':
    case 'rejected':
    case 'sold_out':
      return 'bg-accent/15 text-accent border-accent/30';
    case 'draft':
    default:
      return 'bg-bg text-muted border-line';
  }
};
