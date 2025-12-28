// server/utils/email.js
const nodemailer = require("nodemailer");

// For testing: use Gmail or Mailtrap.
// Gmail vadali ante, app password create cheyyali (2FA on). [web:87][web:90]
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g. "yourmail@gmail.com"
    pass: process.env.EMAIL_PASS, // app password
  },
});

async function sendLoginAlert({ to, userEmail, userName }) {
  const info = await transporter.sendMail({
    from: `"AI Interview Buddy" <${process.env.EMAIL_USER}>`,
    to, // niku vachche mail (e.g. founder email)
    subject: "New user logged in",
    html: `
      <h3>New login detected</h3>
      <p><b>User:</b> ${userName || "Unknown"}</p>
      <p><b>Email:</b> ${userEmail}</p>
      <p><b>Time:</b> ${new Date().toLocaleString()}</p>
    `,
  });

  return info.messageId;
}

module.exports = { sendLoginAlert };
