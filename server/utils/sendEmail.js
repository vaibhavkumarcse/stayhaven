const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

const bookingConfirmationEmail = (booking, property, guest) => ({
  to: guest.email,
  subject: `Booking Confirmed — ${property.title}`,
  html: `
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#e63946">🏠 StayHaven — Booking Confirmed!</h2>
      <p>Hi ${guest.name},</p>
      <p>Your booking has been confirmed. Here are your details:</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Property</strong></td><td style="padding:8px;border:1px solid #eee">${property.title}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Location</strong></td><td style="padding:8px;border:1px solid #eee">${property.location.city}, ${property.location.country}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Check-in</strong></td><td style="padding:8px;border:1px solid #eee">${new Date(booking.checkIn).toDateString()}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Check-out</strong></td><td style="padding:8px;border:1px solid #eee">${new Date(booking.checkOut).toDateString()}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Guests</strong></td><td style="padding:8px;border:1px solid #eee">${booking.guests}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Total</strong></td><td style="padding:8px;border:1px solid #eee">$${booking.totalPrice}</td></tr>
      </table>
      <p style="margin-top:20px">Enjoy your stay! 🌟</p>
    </div>
  `,
});

module.exports = { sendEmail, bookingConfirmationEmail };
