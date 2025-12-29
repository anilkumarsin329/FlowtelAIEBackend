const express = require('express');
const { 
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
} = require('../controllers/meetingController');
const { basicAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/slots/:date', getAvailableSlots);
router.post('/book', bookMeeting);

// Admin routes
router.get('/all-slots', basicAuth, getAllSlots);
router.get('/requests', basicAuth, getAllMeetingRequests);
router.get('/requests/counts', basicAuth, getMeetingRequestCounts);
router.get('/today', basicAuth, getMeetingsByDate);
router.get('/date/:date', basicAuth, getMeetingsByDate);
router.post('/slots', basicAuth, createMeetingSlots);
router.put('/requests/:id/status', basicAuth, updateMeetingStatus);
router.put('/requests/:id', basicAuth, updateMeetingRequest);
router.delete('/requests/:id', basicAuth, deleteMeetingRequest);
router.delete('/slots/:id', basicAuth, deleteMeetingSlot);
router.delete('/slots/date/:date', basicAuth, deleteAllSlotsForDate);

// Email routes
router.post('/send-confirmation-email', basicAuth, (req, res) => {
  res.json({ success: true, message: 'Email functionality handled in status update' });
});
router.post('/send-cancellation-email', basicAuth, (req, res) => {
  res.json({ success: true, message: 'Email functionality handled in status update' });
});
router.post('/send-update-email', basicAuth, (req, res) => {
  res.json({ success: true, message: 'Email functionality handled in update' });
});

module.exports = router;