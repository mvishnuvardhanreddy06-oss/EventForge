const QRCode = require('qrcode');

const generateQRCode = async (dataString) => {
  try {
    return await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (err) {
    throw new Error('Failed to generate QR Code: ' + err.message);
  }
};

module.exports = generateQRCode;
