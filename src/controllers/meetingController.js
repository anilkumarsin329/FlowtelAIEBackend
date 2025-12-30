const Meeting = require('../models/Meeting');
const { sendMeetingConfirmation, sendMeetingUpdateEmail, sendMeetingCancellationEmail } = require('../utils/emailService');

const createMeetingSlots = async (req, res) => {
  try {
    const { date, slots } = req.body;
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const meetingSlots = slots.map(time => ({
      date: targetDate,
      time,
      status: 'available'
    }));
    
    await Meeting.insertMany(meetingSlots);
    res.json({ success: true, data: meetingSlots });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Some slots already exist' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

const bookMeeting = async (req, res) => {
  try {
    const { name, email, phone, date, time, message } = req.body;
    
    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields required' 
      });
    }
    
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    // Check if slot already exists for this date and time
    const existingSlot = await Meeting.findOne({
      date: targetDate,
      time: time
    });
    
    if (existingSlot) {
      // If slot exists and is available, book it
      if (existingSlot.status === 'available') {
        existingSlot.status = 'pending';
        existingSlot.clientName = name;
        existingSlot.clientEmail = email;
        existingSlot.clientPhone = phone;
        existingSlot.message = message || '';
        existingSlot.bookedAt = new Date();
        
        const savedMeeting = await existingSlot.save();
        
        // Send confirmation email
        let emailSent = false;
        try {
          await sendMeetingConfirmation({
            name, email, phone, date, time, message: message || ''
          });
          emailSent = true;
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
        }
        
        return res.json({ 
          success: true,
          message: 'Meeting booked successfully!',
          data: savedMeeting,
          emailSent
        });
      } else {
        return res.status(400).json({
          success: false,
          error: 'This time slot is already booked'
        });
      }
    } else {
      // Create new slot if doesn't exist
      const newMeeting = new Meeting({
        date: targetDate,
        time,
        status: 'pending',
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        message: message || '',
        bookedAt: new Date()
      });
      
      const savedMeeting = await newMeeting.save();
      
      // Send confirmation email
      let emailSent = false;
      try {
        await sendMeetingConfirmation({
          name, email, phone, date, time, message: message || ''
        });
        emailSent = true;
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
      
      return res.json({ 
        success: true,
        message: 'Meeting booked successfully!',
        data: savedMeeting,
        emailSent
      });
    }
    
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getAllMeetingRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search, 
      export: isExport 
    } = req.query;

    // Build query
    let query = {};
    
    // Filter by status (exclude 'available' slots)
    if (status && status !== 'all') {
      query.status = status;
    } else {
      query.status = { $ne: 'available' };
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } }
      ];
    }
    
    // If export is requested, return all data
    if (isExport === 'true') {
      const requests = await Meeting.find(query).sort({ createdAt: -1 });
      return res.json({ data: requests });
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count for pagination
    const total = await Meeting.countDocuments(query);
    
    // Get paginated results
    const requests = await Meeting.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    res.json({ 
      data: requests,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('Error fetching meeting requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// New endpoint for getting tab counts
const getMeetingRequestCounts = async (req, res) => {
  try {
    const counts = await Meeting.aggregate([
      {
        $match: {
          status: { $ne: 'available' }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Initialize all status counts
    const result = {
      all: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    };
    
    // Calculate total and individual counts
    counts.forEach(item => {
      if (item._id && result.hasOwnProperty(item._id)) {
        result[item._id] = item.count;
        result.all += item.count;
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching meeting request counts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateMeetingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;
    
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    const updateData = { status };
    
    if (status === 'confirmed') {
      updateData.confirmedAt = new Date();
      
      // Send confirmation email
      await sendMeetingConfirmation({
        name: meeting.clientName,
        email: meeting.clientEmail,
        phone: meeting.clientPhone,
        date: meeting.date.toISOString().split('T')[0],
        time: meeting.time,
        message: meeting.message || ''
      });
      
    } else if (status === 'cancelled') {
      updateData.cancellationReason = cancellationReason;
      
      // Send cancellation email
      if (meeting.clientEmail) {
        await sendMeetingCancellationEmail({
          name: meeting.clientName,
          email: meeting.clientEmail,
          phone: meeting.clientPhone,
          date: meeting.date.toISOString().split('T')[0],
          time: meeting.time,
          reason: cancellationReason || 'No reason provided'
        });
      }
      
    } else if (status === 'completed') {
      // When meeting is completed, keep client data for result creation
      updateData.completedAt = new Date();
      
    } else if (status === 'available') {
      updateData.clientName = '';
      updateData.clientEmail = '';
      updateData.clientPhone = '';
      updateData.message = '';
      updateData.cancellationReason = '';
      updateData.bookedAt = null;
      updateData.confirmedAt = null;
      updateData.completedAt = null;
    }
    
    const updatedMeeting = await Meeting.findByIdAndUpdate(id, updateData, { new: true });
    
    res.json({ success: true, data: updatedMeeting });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteMeetingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id);
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    if (meeting.status !== 'available') {
      const updatedMeeting = await Meeting.findByIdAndUpdate(
        id,
        {
          status: 'available',
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          message: '',
          cancellationReason: '',
          bookedAt: null,
          confirmedAt: null
        },
        { new: true }
      );
      
      res.json({ success: true, data: updatedMeeting });
    } else {
      await Meeting.findByIdAndDelete(id);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getMeetingsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const meetings = await Meeting.find({
      date: { $gte: targetDate, $lt: nextDay }
    }).sort({ time: 1 });
    
    res.json({ data: meetings });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const meetings = await Meeting.find({
      date: { $gte: targetDate, $lt: nextDay }
    });
    
    const allSlots = [
      '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', 
      '14:00', '14:30', '15:00', '15:30'
    ];
    
    const slots = allSlots.map(time => {
      const meeting = meetings.find(m => m.time === time);
      
      if (!meeting) {
        return { time, status: 'NOT_CREATED' };
      }
      
      if (meeting.status === 'available') {
        return { _id: meeting._id, time, status: 'AVAILABLE', date: meeting.date };
      }
      
      return {
        _id: meeting._id,
        time,
        status: 'BOOKED',
        user: {
          name: meeting.clientName,
          email: meeting.clientEmail,
          phone: meeting.clientPhone
        },
        notes: meeting.message,
        date: meeting.date,
        bookingStatus: meeting.status
      };
    });
    
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const deleteMeetingSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id);
    
    if (!meeting) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    if (meeting.status !== 'available') {
      return res.status(400).json({ error: 'Cannot delete booked slot' });
    }
    
    await Meeting.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateMeetingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const originalMeeting = await Meeting.findById(id);
    if (!originalMeeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    const updatedMeeting = await Meeting.findByIdAndUpdate(id, updates, { new: true });
    
    // Send email if date or time was updated
    if ((updates.date || updates.time) && originalMeeting.clientEmail) {
      await sendMeetingUpdateEmail({
        name: originalMeeting.clientName,
        email: originalMeeting.clientEmail,
        phone: originalMeeting.clientPhone,
        oldDate: originalMeeting.date.toISOString().split('T')[0],
        oldTime: originalMeeting.time,
        newDate: updates.date || originalMeeting.date.toISOString().split('T')[0],
        newTime: updates.time || originalMeeting.time,
        message: originalMeeting.message || ''
      });
    }
    
    res.json({ success: true, data: updatedMeeting });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllSlots = async (req, res) => {
  try {
    const meetings = await Meeting.find({}).sort({ date: 1, time: 1 });
    
    const allSlots = [
      '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', 
      '14:00', '14:30', '15:00', '15:30'
    ];
    
    // Get unique dates from meetings
    const dates = [...new Set(meetings.map(m => m.date.toISOString().split('T')[0]))];
    
    const slotsData = [];
    
    dates.forEach(date => {
      allSlots.forEach(time => {
        const meeting = meetings.find(m => 
          m.date.toISOString().split('T')[0] === date && m.time === time
        );
        
        if (meeting) {
          slotsData.push({
            _id: meeting._id,
            date,
            time,
            status: meeting.status,
            clientName: meeting.clientName || null,
            clientEmail: meeting.clientEmail || null,
            clientPhone: meeting.clientPhone || null,
            message: meeting.message || null,
            createdAt: meeting.createdAt
          });
        }
      });
    });
    
    res.json({ success: true, data: slotsData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const deleteAllSlotsForDate = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Only delete available slots, not booked ones
    const result = await Meeting.deleteMany({
      date: { $gte: targetDate, $lt: nextDay },
      status: 'available'
    });
    
    res.json({ 
      success: true, 
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} available slots deleted` 
    });
  } catch (error) {
    console.error('Delete all slots error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createMeetingSlots,
  bookMeeting,
  getAllMeetingRequests,
  getMeetingRequestCounts,
  updateMeetingStatus,
  updateMeetingRequest,
  deleteMeetingRequest,
  getMeetingsByDate,
  getAvailableSlots,
  deleteMeetingSlot,
  getAllSlots,
  deleteAllSlotsForDate
};