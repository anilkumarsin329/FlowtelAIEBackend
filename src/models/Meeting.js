const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'confirmed', 'cancelled'],
    default: 'available'
  },
  // Client Information (only when booked)
  clientName: {
    type: String,
    default: ''
  },
  clientEmail: {
    type: String,
    default: ''
  },
  clientPhone: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  // Admin fields
  cancellationReason: {
    type: String,
    default: ''
  },
  // Booking timestamp
  bookedAt: {
    type: Date
  },
  confirmedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index for date and time uniqueness
meetingSchema.index({ date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Meeting', meetingSchema);