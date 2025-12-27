const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendMeetingConfirmation = async (meetingData) => {
  try {
    const { name, email, phone, date, time, message } = meetingData;
    
    // Email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Meeting Request Confirmation - FlowtelAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">FlowtelAI</h1>
            <p style="color: white; margin: 10px 0 0 0;">Hotel Management Platform</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Meeting Request Received!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Dear ${name},<br><br>
              Thank you for scheduling a meeting with FlowtelAI. We have received your request and will contact you within 2 hours to confirm the details.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Meeting Details:</h3>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              ${message ? `<p style="margin: 5px 0;"><strong>Message:</strong> ${message}</p>` : ''}
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Our team will reach out to you shortly to confirm the meeting and provide the meeting link.
            </p>
            
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
      `
    };
    
    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Meeting Request - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Meeting Request</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Preferred Date:</strong> ${date}</p>
            <p><strong>Preferred Time:</strong> ${time}</p>
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="color: #666; margin-top: 20px;">
            Please contact the customer within 2 hours to confirm the meeting.
          </p>
        </div>
      `
    };
    
    // Send both emails with better error handling
    try {
      await transporter.sendMail(customerMailOptions);
      console.log('Customer email sent successfully');
    } catch (error) {
      console.error('Error sending customer email:', error.message);
    }
    
    try {
      await transporter.sendMail(adminMailOptions);
      console.log('Admin email sent successfully');
    } catch (error) {
      console.error('Error sending admin email:', error.message);
    }
    
    console.log('Meeting confirmation emails sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending meeting confirmation emails:', error);
    return false;
  }
};

const sendMeetingUpdateEmail = async (updateData) => {
  try {
    const { email, name, phone, oldDate, oldTime, newDate, newTime } = updateData;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Meeting Schedule Updated - FlowtelAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">FlowtelAI</h1>
            <p style="color: white; margin: 10px 0 0 0;">Hotel Management Platform</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Meeting Schedule Updated</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Dear ${name},<br><br>
              Your meeting schedule has been updated. Please find the details below:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Previous Schedule:</h3>
              <p style="margin: 5px 0; color: #999;"><strong>Date:</strong> ${oldDate}</p>
              <p style="margin: 5px 0; color: #999;"><strong>Time:</strong> ${oldTime}</p>
              
              <h3 style="color: #333; margin-top: 20px;">New Schedule:</h3>
              <p style="margin: 5px 0; color: #28a745;"><strong>Date:</strong> ${newDate}</p>
              <p style="margin: 5px 0; color: #28a745;"><strong>Time:</strong> ${newTime}</p>
              ${phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              If you have any questions or need to make further changes, please contact us.
            </p>
            
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
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Meeting update email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending meeting update email:', error);
    return false;
  }
};

const sendMeetingCancellationEmail = async (cancellationData) => {
  try {
    const { email, name, phone, date, time, reason } = cancellationData;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Meeting Cancelled - FlowtelAI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">FlowtelAI</h1>
            <p style="color: white; margin: 10px 0 0 0;">Hotel Management Platform</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Meeting Cancelled</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Dear ${name},<br><br>
              We regret to inform you that your scheduled meeting has been cancelled.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <h3 style="color: #333; margin-top: 0;">Cancelled Meeting Details:</h3>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
              ${phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
              <p style="margin: 5px 0;"><strong>Reason:</strong> ${reason}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              We apologize for any inconvenience caused. Please feel free to reschedule your meeting at your convenience.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:+917079578207" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
                Call Us: +91 7079578207
              </a>
              <a href="mailto:anilkumarsingh43425@gmail.com" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reschedule Meeting
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center;">
              Best regards,<br>
              FlowtelAI Team
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Meeting cancellation email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending meeting cancellation email:', error);
    return false;
  }
};

module.exports = {
  sendMeetingConfirmation,
  sendMeetingUpdateEmail,
  sendMeetingCancellationEmail
};