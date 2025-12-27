require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(` FlowtelAI Backend running on port ${PORT}`);
  console.log(` API Base URL: http://localhost:${PORT}`);
});