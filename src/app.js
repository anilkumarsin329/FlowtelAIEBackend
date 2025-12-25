const express = require('express');
const cors = require('cors');
const demoRoutes = require('./routes/demoRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'FlowtelAI Backend API',
    version: '1.0.0',
    endpoints: {
      demo: '/api/demo',
      newsletter: '/api/newsletter',
      meeting: '/api/meeting'
    }
  });
});

app.use('/api/demo', demoRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/meeting', meetingRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;