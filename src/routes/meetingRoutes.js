const express = require('express');
const { sendMeetingEmail, getAllMeetings } = require('../controllers/meetingController');
const { basicAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/meeting - Send meeting request (public)
router.post('/', sendMeetingEmail);

// GET /api/meeting - Get all meetings (protected)
router.get('/', basicAuth, getAllMeetings);

module.exports = router;