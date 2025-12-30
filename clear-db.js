const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Meeting = require('./src/models/Meeting');
  const MeetingRequest = require('./src/models/MeetingRequest');
  
  await Meeting.deleteMany({});
  await MeetingRequest.deleteMany({});
  
  console.log('✅ All meeting data cleared!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err)
  process.exit(1);
});