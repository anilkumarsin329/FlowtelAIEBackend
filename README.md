# FlowtelAI Backend

Backend API for FlowtelAI - AI-powered hospitality solutions platform.

## 🚀 Features

- **Meeting Management** - Schedule and manage meetings
- **Newsletter System** - Email subscription management  
- **Demo Requests** - Handle demo request submissions
- **Authentication** - Basic auth for admin endpoints
- **Email Integration** - Automated email notifications
- **MongoDB Integration** - Data persistence

## 📡 API Endpoints

### Public Endpoints
- `POST /api/meeting` - Submit meeting request
- `POST /api/newsletter` - Subscribe to newsletter
- `POST /api/demo` - Submit demo request

### Protected Endpoints (Basic Auth)
- `GET /api/meeting` - Get all meetings
- `GET /api/newsletter` - Get all subscribers
- `GET /api/demo` - Get all demo requests

## 🛠️ Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your values:
   ```
   PORT=3001
   NODE_ENV=development
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_app_password
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_password
   ```

3. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📧 Email Configuration

1. Enable 2-Factor Authentication in Gmail
2. Generate App Password
3. Use App Password in `EMAIL_PASS` environment variable

## 🔐 Authentication

Protected endpoints use Basic Authentication:
- Username: `admin` (or your ADMIN_USERNAME)
- Password: Your ADMIN_PASSWORD

## 📊 Database

- **Database**: MongoDB
- **Collections**: meetings, newsletters, demorequests
- **Connection**: mongodb://localhost:27017/flowtelai

## 🏗️ Project Structure

```
src/
├── config/
│   ├── database.js      # MongoDB connection
│   └── email.js         # Email configuration
├── controllers/
│   ├── demoController.js
│   ├── meetingController.js
│   └── newsletterController.js
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── errorHandler.js  # Error handling
├── models/
│   ├── DemoRequest.js
│   ├── Meeting.js
│   └── Newsletter.js
├── routes/
│   ├── demoRoutes.js
│   ├── meetingRoutes.js
│   └── newsletterRoutes.js
├── utils/
│   └── validation.js    # Input validation
└── app.js               # Express app setup
```

## 🚀 Deployment

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible
3. Update CORS settings if needed
4. Run `npm start`

## 📝 License

MIT License - see LICENSE file for details.

---

**FlowtelAI Team** - Transforming hospitality with AI