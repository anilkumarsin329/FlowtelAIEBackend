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

const updateDemoRequest = async (req, res) => {
  try {
    const { id } = req.params;
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
    
    const updatedRequest = await DemoRequest.findByIdAndUpdate(
      id,
      { name, email, hotel, rooms: parseInt(rooms), phone },
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ error: 'Demo request not found' });
    }
    
    res.json({ 
      success: true,
      message: 'Demo request updated successfully',
      data: updatedRequest 
    });
  } catch (error) {
    console.error('Update demo request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteDemoRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRequest = await DemoRequest.findByIdAndDelete(id);
    
    if (!deletedRequest) {
      return res.status(404).json({ error: 'Demo request not found' });
    }
    
    res.json({ 
      success: true,
      message: 'Demo request deleted successfully' 
    });
  } catch (error) {
    console.error('Delete demo request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  submitDemoRequest,
  getAllDemoRequests,
  updateDemoRequest,
  deleteDemoRequest
};