const DemoRequest = require('../models/DemoRequest');
const { validateEmail, validatePhone, validateRequired } = require('../utils/validation');

const submitDemoRequest = async (req, res) => {
  try {
    const { name, email, hotel, rooms, phone } = req.body;
    
    // Validation
    if (!validateRequired([name, email, hotel, rooms, phone])) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (!validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    
    // Create demo request
    const demoRequest = new DemoRequest({
      name,
      email,
      hotel,
      rooms: parseInt(rooms),
      phone
    });
    
    await demoRequest.save();
    
    res.status(201).json({ 
      message: 'Demo request submitted successfully',
      data: demoRequest 
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllDemoRequests = async (req, res) => {
  try {
    const requests = await DemoRequest.find().sort({ createdAt: -1 });
    res.json({ data: requests });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  submitDemoRequest,
  getAllDemoRequests
};