const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const demoRoutes = require('./routes/demoRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const meetingResultRoutes = require('./routes/meetingResultRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Database connection handled in server.js

// --------------------
// Middleware
// --------------------
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'https://flowtel-aie.vercel.app',
    'https://flowtel-admin.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --------------------
// Health Check
// --------------------
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'FlowtelAI Backend API Running',
    version: '1.0.0',
    database: 'MongoDB',
    endpoints: {
      demo: '/api/demo',
      newsletter: '/api/newsletter',
      meetings: '/api/meetings',
      meetingResults: '/api/meeting-results'
    }
  });
});

// --------------------
// API Routes
// --------------------
app.use('/api/demo', demoRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/meeting-results', meetingResultRoutes);

// --------------------
// Error Handling
// --------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
