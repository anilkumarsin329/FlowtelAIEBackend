const mongoose = require('mongoose');

const meetingResultSchema = new mongoose.Schema({
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    required: true,
    unique: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String,
    required: true
  },
  meetingDate: {
    type: Date,
    required: true
  },
  meetingTime: {
    type: String,
    required: true
  },
  meetingSummary: {
    type: String,
    required: true
  },
  clientRequirement: {
    type: String,
    required: true
  },
  outcome: {
    type: String,
    enum: ['Interested', 'Not Interested', 'Need Time', 'Deal Closed'],
    required: true
  },
  nextAction: {
    type: String,
    enum: ['Follow-up Call', 'Proposal Send', 'Demo Required', 'None'],
    required: true
  },
  followUpDate: {
    type: Date
  },
  adminNotes: {
    type: String
  },
  followUpCompleted: {
    type: Boolean,
    default: false
  },
  recordingUrl: {
    type: String
  },
  recordingType: {
    type: String,
    enum: ['video', 'audio'],
    default: 'audio'
  },
  recordingDuration: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MeetingResult', meetingResultSchema);