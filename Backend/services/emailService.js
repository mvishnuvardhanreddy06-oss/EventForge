const { createTransporter } = require('../config/email');

const sendRegistrationConfirmation = async (attendeeEmail, registrationDetails) => {
  const transporter = createTransporter();
  const { eventTitle, registrationNumber, ticketName, finalAmount } = registrationDetails;

  const subject = `Confirmed: Registration for ${eventTitle} (${registrationNumber})`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
      <h2>Registration Confirmed!</h2>
      <p>Thank you for registering for <strong>${eventTitle}</strong>.</p>
      <p><strong>Registration Number:</strong> ${registrationNumber}</p>
      <p><strong>Ticket Category:</strong> ${ticketName}</p>
      <p><strong>Amount:</strong> $${finalAmount}</p>
      <p>Your unique QR ticket is available in your EventForge dashboard.</p>
      <hr/>
      <small>EventForge — Corporate Event Management Platform</small>
    </div>
  `;

  if (!transporter) {
    console.log(`[Email Service Simulation] Confirmation sent to ${attendeeEmail} for ${eventTitle}`);
    return true;
  }

  try {
    await transporter.sendMail({
      from: 'no-reply@eventforge.io',
      to: attendeeEmail,
      subject,
      html
    });
    return true;
  } catch (err) {
    console.error('Email send failed:', err.message);
    return false;
  }
};

module.exports = {
  sendRegistrationConfirmation
};
