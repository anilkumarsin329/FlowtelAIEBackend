const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }
    
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flowtelai';
    
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
      bufferMaxEntries: 0,
    };
    
    await mongoose.connect(mongoURI, options);
    console.log('✅ MongoDB Connected:', mongoose.connection.host);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

module.exports = connectDB;