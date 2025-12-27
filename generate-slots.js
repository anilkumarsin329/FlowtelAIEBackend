const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flowtelai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Meeting Schema (same as in models)
const meetingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  clientName: { type: String },
  clientEmail: { type: String },
  clientPhone: { type: String },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['available', 'booked'], 
    default: 'available' 
  }
}, {
  timestamps: true
});

const Meeting = mongoose.model('Meeting', meetingSchema);

// Generate sample slots for next 7 days
async function generateSampleSlots() {
  try {
    console.log('Generating sample meeting slots...');
    
    const today = new Date();
    const slots = [];
    
    // Generate for next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Available time slots
      const timeSlots = [
        '09:00', '09:15', '09:30', '09:45',
        '10:00', '10:15', '10:30', '10:45',
        '11:00', '11:15', '11:30', '11:45',
        '14:00', '14:15', '14:30', '14:45',
        '15:00', '15:15', '15:30', '15:45',
        '16:00', '16:15', '16:30', '16:45'
      ];
      
      // Create some booked slots randomly for demo
      const bookedSlots = timeSlots.filter(() => Math.random() < 0.3);
      
      for (const time of timeSlots) {
        const isBooked = bookedSlots.includes(time);
        
        slots.push({
          date,
          time,
          status: isBooked ? 'booked' : 'available',
          ...(isBooked && {
            clientName: 'Demo Client',
            clientEmail: 'demo@example.com',
            clientPhone: '+91 9876543210',
            notes: 'Demo booking'
          })
        });
      }
    }
    
    // Clear existing slots
    await Meeting.deleteMany({});
    
    // Insert new slots
    await Meeting.insertMany(slots);
    
    console.log(`✅ Generated ${slots.length} meeting slots for next 7 days`);
    console.log(`📅 Available slots: ${slots.filter(s => s.status === 'available').length}`);
    console.log(`🔴 Booked slots: ${slots.filter(s => s.status === 'booked').length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating slots:', error);
    process.exit(1);
  }
}

generateSampleSlots();