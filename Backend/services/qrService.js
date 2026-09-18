const crypto = require('crypto');
const generateQRCode = require('../utils/generateQR');

/**
 * Generates a unique secure token for registration QR check-in
 */
const generateQRToken = (registrationId, eventId, attendeeId) => {
  const payload = `${registrationId}:${eventId}:${attendeeId}:${Date.now()}`;
  const hash = crypto.createHmac('sha256', process.env.JWT_SECRET || 'eventforge_secret_2026')
    .update(payload)
    .digest('hex');
  return `EFQR-${hash.substring(0, 24)}`;
};

/**
 * Generates data URL representation of QR code
 */
const createRegistrationQR = async (qrToken, registrationNumber, eventTitle) => {
  const qrPayload = JSON.stringify({
    token: qrToken,
    regNo: registrationNumber,
    event: eventTitle,
    verifiedBy: 'EventForge'
  });
  return await generateQRCode(qrPayload);
};

module.exports = {
  generateQRToken,
  createRegistrationQR
};
