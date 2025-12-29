const MeetingResult = require('../models/MeetingResult');
const Meeting = require('../models/Meeting');

const saveMeetingResult = async (req, res) => {
  try {
    const { meetingId, meetingSummary, clientRequirement, outcome, nextAction, followUpDate, adminNotes, recordingUrl, recordingType, recordingDuration } = req.body;
    
    // Check if meeting exists and is completed
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }
    
    if (meeting.status !== 'completed') {
      return res.status(400).json({ error: 'Meeting must be completed first' });
    }
    
    // Check if result already exists
    const existingResult = await MeetingResult.findOne({ meetingId });
    if (existingResult) {
      return res.status(400).json({ error: 'Meeting result already exists' });
    }
    
    const meetingResult = new MeetingResult({
      meetingId,
      clientName: meeting.clientName,
      clientEmail: meeting.clientEmail,
      clientPhone: meeting.clientPhone,
      meetingDate: meeting.date,
      meetingTime: meeting.time,
      meetingSummary,
      clientRequirement,
      outcome,
      nextAction,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      adminNotes,
      recordingUrl,
      recordingType,
      recordingDuration
    });
    
    await meetingResult.save();
    
    res.json({ 
      success: true, 
      message: 'Meeting result saved successfully',
      data: meetingResult 
    });
  } catch (error) {
    console.error('Save meeting result error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllMeetingResults = async (req, res) => {
  try {
    const results = await MeetingResult.find()
      .populate('meetingId')
      .sort({ createdAt: -1 });
    
    res.json({ data: results });
  } catch (error) {
    console.error('Get meeting results error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMeetingResult = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MeetingResult.findById(id).populate('meetingId');
    
    if (!result) {
      return res.status(404).json({ error: 'Meeting result not found' });
    }
    
    res.json({ data: result });
  } catch (error) {
    console.error('Get meeting result error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateFollowUpStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { followUpCompleted } = req.body;
    
    const result = await MeetingResult.findByIdAndUpdate(
      id,
      { followUpCompleted },
      { new: true }
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Meeting result not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Follow-up status updated',
      data: result 
    });
  } catch (error) {
    console.error('Update follow-up error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getResultStats = async (req, res) => {
  try {
    const totalCompleted = await MeetingResult.countDocuments();
    const followUpsPending = await MeetingResult.countDocuments({ 
      nextAction: { $ne: 'None' }, 
      followUpCompleted: false 
    });
    const dealsClosed = await MeetingResult.countDocuments({ outcome: 'Deal Closed' });
    const interested = await MeetingResult.countDocuments({ outcome: 'Interested' });
    
    const conversionRate = totalCompleted > 0 ? ((dealsClosed / totalCompleted) * 100).toFixed(1) : 0;
    
    res.json({
      data: {
        totalCompleted,
        followUpsPending,
        dealsClosed,
        interested,
        conversionRate
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  saveMeetingResult,
  getAllMeetingResults,
  getMeetingResult,
  updateFollowUpStatus,
  getResultStats
};