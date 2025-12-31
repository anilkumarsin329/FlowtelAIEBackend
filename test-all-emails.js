require('dotenv').config();
const { sendMeetingConfirmation, sendMeetingUpdateEmail, sendMeetingCancellationEmail } = require('./src/utils/emailService');
const { sendWelcomeEmail } = require('./src/config/email');

const testAllEmails = async () => {
  console.log('🔍 Testing All Email Functions...\n');
  
  const testEmail = process.env.EMAIL_USER;
  
  try {
    // Test 1: Newsletter Welcome Email
    console.log('📧 Testing Newsletter Welcome Email...');
    await sendWelcomeEmail(testEmail);
    console.log('✅ Newsletter welcome email sent successfully!\n');
    
    // Test 2: Meeting Confirmation Email
    console.log('📧 Testing Meeting Confirmation Email...');
    await sendMeetingConfirmation({
      name: 'Test User',
      email: testEmail,
      phone: '+91 9876543210',
      date: '2024-12-20',
      time: '10:30',
      message: 'This is a test meeting request'
    });
    console.log('✅ Meeting confirmation email sent successfully!\n');
    
    // Test 3: Meeting Update Email
    console.log('📧 Testing Meeting Update Email...');
    await sendMeetingUpdateEmail({
      name: 'Test User',
      email: testEmail,
      phone: '+91 9876543210',
      oldDate: '2024-12-20',
      oldTime: '10:30',
      newDate: '2024-12-21',
      newTime: '11:00'
    });
    console.log('✅ Meeting update email sent successfully!\n');
    
    // Test 4: Meeting Cancellation Email
    console.log('📧 Testing Meeting Cancellation Email...');
    await sendMeetingCancellationEmail({
      name: 'Test User',
      email: testEmail,
      phone: '+91 9876543210',
      date: '2024-12-21',
      time: '11:00',
      reason: 'Testing cancellation email functionality'
    });
    console.log('✅ Meeting cancellation email sent successfully!\n');
    
    console.log('🎉 ALL EMAIL FUNCTIONS ARE WORKING PERFECTLY!');
    console.log('📬 Check your email inbox for all test emails.');
    
  } catch (error) {
    console.log('❌ Email test failed:');
    console.log('Error:', error.message);
    console.log('Stack:', error.stack);
  }
};

testAllEmails();