const Newsletter = require('../models/Newsletter');
const { sendWelcomeEmail } = require('../config/email');
const { validateEmail } = require('../utils/validation');

const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    
    // Save to database first
    const newsletter = new Newsletter({ email });
    await newsletter.save();
    
    // Send welcome email asynchronously with better logging
    setImmediate(async () => {
      try {
        console.log('📧 Sending welcome email to:', email);
        const result = await sendWelcomeEmail(email);
        if (result) {
          console.log('✅ Welcome email sent successfully to:', email);
        } else {
          console.log('❌ Welcome email failed for:', email);
        }
      } catch (emailError) {
        console.error('❌ Welcome email error for:', email, emailError.message);
      }
    });
    
    res.status(201).json({ 
      message: 'Successfully subscribed to newsletter!',
      data: { email },
      emailStatus: 'processing'
    });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ data: subscribers });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedSubscriber = await Newsletter.findByIdAndDelete(id);
    
    if (!deletedSubscriber) {
      return res.status(404).json({ error: 'Subscriber not found' });
    }
    
    res.json({ 
      success: true,
      message: 'Subscriber deleted successfully' 
    });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  subscribeNewsletter,
  getAllSubscribers,
  deleteSubscriber
};