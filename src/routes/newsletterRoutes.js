const express = require('express');
const { subscribeNewsletter, getAllSubscribers, deleteSubscriber } = require('../controllers/newsletterController');
const { basicAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/newsletter - Subscribe to newsletter (public)
router.post('/', subscribeNewsletter);

// GET /api/newsletter - Get all subscribers (protected)
router.get('/', basicAuth, getAllSubscribers);

// DELETE /api/newsletter/:id - Delete subscriber (protected)
router.delete('/:id', basicAuth, deleteSubscriber);

module.exports = router;