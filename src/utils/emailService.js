const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Use environment variable for sender domain or fallback to resend.dev
const SENDER_EMAIL = process.env.SENDER_DOMAIN ? `FlowtelAI <noreply@${process.env.SENDER_DOMAIN}>` : 'FlowtelAI <noreply@resend.dev>';

const formatDate = (date) => {
  try {
    if (!date) return "Date not specified";
    const [year, month, day] = date.split("-");
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Date not specified";
  }
};

const sendMeetingConfirmation = async (data) => {
  try {
    const { name, email, phone, date, time, message } = data;

    if (!email || !name || !process.env.RESEND_API_KEY) {
      throw new Error("Required fields missing");
    }

    const formattedDate = formatDate(date);

    // Send email to customer
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [email],
      subject: 'Meeting Request Received - FlowtelAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">FlowtelAI</h1>
            <p style="color: white; margin: 10px 0 0 0;">Hotel Management Platform</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Meeting Request Received!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Dear ${name},<br><br>
              Thank you for scheduling a meeting with FlowtelAI. We will contact you within 2 hours to confirm the details.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">Meeting Details:</h3>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${time || 'Not specified'}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              ${message ? `<p style="margin: 5px 0;"><strong>Message:</strong> ${message}</p>` : ''}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:+917079578207" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Call Us: +91 7079578207
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

    // Send email to admin
    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [process.env.EMAIL_USER || 'anilkumarsingh43425@gmail.com'],
      subject: `New Meeting Request - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">New Meeting Request</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${time || 'Not specified'}</p>
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Meeting confirmation email error:', error.message);
    return false;
  }
};

const sendMeetingUpdateEmail = async (data) => {
  try {
    const { email, name, phone, oldDate, newDate, oldTime, newTime } = data;

    if (!email || !name || !process.env.RESEND_API_KEY) {
      throw new Error("Required fields missing");
    }

    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [email],
      subject: 'Meeting Schedule Updated - FlowtelAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">FlowtelAI</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Meeting Schedule Updated</h2>
            
            <p>Dear ${name},<br><br>Your meeting schedule has been updated:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Previous:</h3>
              <p style="color: #999;"><strong>Date:</strong> ${formatDate(oldDate)}</p>
              <p style="color: #999;"><strong>Time:</strong> ${oldTime || 'Not specified'}</p>
              
              <h3>New Schedule:</h3>
              <p style="color: #28a745;"><strong>Date:</strong> ${formatDate(newDate)}</p>
              <p style="color: #28a745;"><strong>Time:</strong> ${newTime || 'Not specified'}</p>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center;">
              Best regards,<br>FlowtelAI Team
            </p>
          </div>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Meeting update email error:', error.message);
    return false;
  }
};

const sendMeetingCancellationEmail = async (data) => {
  try {
    const { email, name, phone, date, time, reason } = data;

    if (!email || !name || !process.env.RESEND_API_KEY) {
      throw new Error("Required fields missing");
    }

    await resend.emails.send({
      from: SENDER_EMAIL,
      to: [email],
      subject: 'Meeting Cancelled - FlowtelAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">FlowtelAI</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Meeting Cancelled</h2>
            
            <p>Dear ${name},<br><br>Your scheduled meeting has been cancelled.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <p><strong>Date:</strong> ${formatDate(date)}</p>
              <p><strong>Time:</strong> ${time || 'Not specified'}</p>
              <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
            </div>
            
            <p>We apologize for any inconvenience. Please feel free to reschedule.</p>
            
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:+917079578207" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Call Us: +91 7079578207
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center;">
              Best regards,<br>FlowtelAI Team
            </p>
          </div>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error('Meeting cancellation email error:', error.message);
    return false;
  }
};

module.exports = {
  sendMeetingConfirmation,
  sendMeetingUpdateEmail,
  sendMeetingCancellationEmail,
};
