const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS  // Your app password
  }
});

const sendWelcomeEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to FlowtelAI Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to FlowtelAI!</h2>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You'll receive updates about our latest AI solutions for hotels.</p>
        <br>
        <p>Best regards,<br>FlowtelAI Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail
};