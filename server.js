require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected Successfully');

    app.listen(PORT, () => {
      console.log(` FlowtelAI Backend running on port ${PORT}`);
      console.log(` API Base URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
