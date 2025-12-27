require('dotenv').config();
const mongoose = require('mongoose');
const Meeting = require('./src/models/Meeting');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/flowtelai');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const createSampleMeetings = async () => {
  try {
    await connectDB();
    
    // Clear existing meetings for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    await Meeting.deleteMany({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    // Create sample meeting slots for today
    const sampleMeetings = [
      {
        date: today,
        time: '10:00 AM',
        status: 'available'
      },
      {
        date: today,
        time: '11:00 AM',
        status: 'available'
      },
      {
        date: today,
        time: '2:00 PM',
        status: 'booked',
        clientName: 'Jane Smith',
        clientEmail: 'jane@example.com',
        clientPhone: '9876543210'
      },
      {
        date: today,
        time: '3:00 PM',
        status: 'available'
      },
      {
        date: today,
        time: '4:00 PM',
        status: 'available'
      },
      {
        date: today,
        time: '6:00 PM',
        status: 'booked',
        clientName: 'Mike Johnson',
        clientEmail: 'mike@example.com',
        clientPhone: '9876543211'
      }
    ];
    
    await Meeting.insertMany(sampleMeetings);
    console.log('✅ Sample meetings created successfully');
    
    // Display created meetings
    const meetings = await Meeting.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).sort({ time: 1 });
    
    console.log('\n📅 Today\'s Meeting Slots:');
    meetings.forEach(meeting => {
      console.log(`${meeting.time} - ${meeting.status.toUpperCase()}${meeting.clientName ? ` (${meeting.clientName})` : ''}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample meetings:', error);
    process.exit(1);
  }
};

createSampleMeetings();