const express = require('express');
const { submitDemoRequest, getAllDemoRequests, updateDemoRequest, deleteDemoRequest } = require('../controllers/demoController');
const { basicAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/demo - Submit demo request (public)
router.post('/', submitDemoRequest);

// GET /api/demo - Get all demo requests (protected)
router.get('/', basicAuth, getAllDemoRequests);

// PUT /api/demo/:id - Update demo request (protected)
router.put('/:id', basicAuth, updateDemoRequest);

// DELETE /api/demo/:id - Delete demo request (protected)
router.delete('/:id', basicAuth, deleteDemoRequest);

module.exports = router;