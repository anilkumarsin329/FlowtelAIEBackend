const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Use aitotateam@gmail.com as sender email
const SENDER_EMAIL = 'FlowtelAI <aitotateam@gmail.com>';

const sendWelcomeEmail = async (email) => {
  try {
    if (!email || !process.env.RESEND_API_KEY) {
      throw new Error("Email address and API key required");
    }

    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [email],
      subject: 'Welcome to FlowtelAI Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">FlowtelAI</h1>
            <p style="color: white; margin: 10px 0 0 0;">Hotel Management Platform</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to FlowtelAI!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Thank you for subscribing to our newsletter! We're excited to have you on board.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">What to Expect:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>Latest updates about our AI-powered hotel management solutions</li>
                <li>Industry insights and best practices</li>
                <li>Exclusive offers and early access to new features</li>
                <li>Success stories from hotels using FlowtelAI</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:+917079578207" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
                Contact Us: +91 7079578207
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center;">
              Best regards,<br>
              FlowtelAI Team
            </p>
          </div>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Welcome email error:', error.message);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail
};