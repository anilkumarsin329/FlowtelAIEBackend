const nodemailer = require('nodemailer');
const Meeting = require('../models/Meeting');

const sendMeetingEmail = async (req, res) => {
  try {
    const { name, email, phone, date, time, message } = req.body;
    
    console.log('Meeting request received:', { name, email, phone, date, time, message });
    
    // Save to database first
    const meeting = new Meeting({
      name,
      email,
      phone,
      date,
      time,
      message: message || ''
    });
    
    await meeting.save();
    console.log('✅ Meeting saved to database with ID:', meeting._id);
    
    // Try to send emails
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      // Admin email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `🗓️ New Meeting Request - ${name}`,
        html: `
          <h2>New Meeting Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Message:</strong> ${message || 'No message'}</p>
          <p><strong>Meeting ID:</strong> ${meeting._id}</p>
        `
      });
      
      // User confirmation email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `✅ Meeting Confirmed - FlowtelAI`,
        html: `
          <h2>Meeting Request Confirmed!</h2>
          <p>Hi ${name},</p>
          <p>Your meeting request has been received:</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Reference ID:</strong> ${meeting._id}</p>
          <p>We will contact you within 2 hours.</p>
          <p>Best regards,<br>FlowtelAI Team</p>
        `
      });
      
      console.log('✅ Emails sent successfully');
    } catch (emailError) {
      console.log('⚠️ Email failed (but meeting saved):', emailError.message);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Meeting request submitted successfully! We will contact you within 2 hours.',
      data: {
        meetingId: meeting._id,
        name,
        email,
        phone,
        date,
        time,
        status: meeting.status
      }
    });
    
  } catch (error) {
    console.error('❌ Meeting request error:', error);
    res.status(500).json({ 
      success: false, 
      message: `Error: ${error.message}` 
    });
  }
};

const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.json({ 
      success: true,
      data: meetings,
      count: meetings.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch meetings' 
    });
  }
};

module.exports = { 
  sendMeetingEmail, 
  getAllMeetings
};