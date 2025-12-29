const express = require('express');
const { 
  saveMeetingResult,
  getAllMeetingResults,
  getMeetingResult,
  updateFollowUpStatus,
  getResultStats
} = require('../controllers/meetingResultController');
const { basicAuth } = require('../middleware/auth');

const router = express.Router();

// All routes are admin protected
router.post('/', basicAuth, saveMeetingResult);
router.get('/', basicAuth, getAllMeetingResults);
router.get('/stats', basicAuth, getResultStats);
router.get('/:id', basicAuth, getMeetingResult);
router.put('/:id/follow-up', basicAuth, updateFollowUpStatus);

module.exports = router;