const express = require('express');
const { subscribeNewsletter, getAllSubscribers } = require('../controllers/newsletterController');
const { basicAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/newsletter - Subscribe to newsletter (public)
router.post('/', subscribeNewsletter);

// GET /api/newsletter - Get all subscribers (protected)
router.get('/', basicAuth, getAllSubscribers);

module.exports = router;