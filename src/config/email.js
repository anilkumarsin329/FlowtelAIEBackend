const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (email) => {
  console.log("📧 Sending welcome email to:", email);
  try {
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
    console.log("✅ Welcome email sent successfully");
  } catch (error) {
    console.error("❌ Welcome email error:", error.message);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail
};