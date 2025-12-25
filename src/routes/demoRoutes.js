const express = require('express');
const { submitDemoRequest, getAllDemoRequests } = require('../controllers/demoController');
const { basicAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/demo - Submit demo request (public)
router.post('/', submitDemoRequest);

// GET /api/demo - Get all demo requests (protected)
router.get('/', basicAuth, getAllDemoRequests);

module.exports = router;