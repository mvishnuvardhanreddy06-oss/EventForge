const calculateAnalytics = (registrations = [], sessions = [], tickets = [], feedback = []) => {
  const totalRegistrations = registrations.length;
  const confirmedRegistrations = registrations.filter(r => r.status === 'confirmed').length;
  const waitlisted = registrations.filter(r => r.status === 'waitlisted').length;
  const cancelled = registrations.filter(r => r.status === 'cancelled').length;
  const checkIns = registrations.filter(r => r.checkedIn === true).length;
  
  const attendanceRate = confirmedRegistrations > 0 
    ? Math.round((checkIns / confirmedRegistrations) * 100) 
    : 0;
  
  const noShowRate = 100 - attendanceRate;

  const totalRevenue = registrations
    .filter(r => r.status === 'confirmed' && r.paymentStatus === 'paid')
    .reduce((sum, r) => sum + (r.finalAmount || 0), 0);

  const avgRating = feedback.length > 0
    ? +(feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : 5.0;

  return {
    totalRegistrations,
    confirmedRegistrations,
    waitlisted,
    cancelled,
    checkIns,
    attendanceRate,
    noShowRate,
    totalRevenue,
    avgRating
  };
};

module.exports = calculateAnalytics;
