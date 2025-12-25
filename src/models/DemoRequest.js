const mongoose = require('mongoose');

const demoRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  hotel: {
    type: String,
    required: true,
    trim: true
  },
  rooms: {
    type: Number,
    required: true,
    min: 1
  },
  phone: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DemoRequest', demoRequestSchema);