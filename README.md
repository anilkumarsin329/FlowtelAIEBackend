# FlowtelAI Backend API

A robust Node.js backend API for FlowtelAI meeting management system with email notifications and admin authentication.

## Features

- **Meeting Management**: Complete CRUD operations for meeting slots and requests
- **Email Notifications**: Automated email notifications for booking confirmations, updates, and cancellations
- **Admin Authentication**: Basic authentication for admin panel access
- **Demo Requests**: Handle demo booking requests
- **Newsletter Management**: Manage newsletter subscriptions
- **MongoDB Integration**: Persistent data storage with MongoDB

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Email Service**: Nodemailer with Gmail SMTP
- **Authentication**: Basic Auth for admin routes
- **Environment**: dotenv for configuration

## API Endpoints

### Public Routes
- `GET /api/meetings/slots/:date` - Get available slots for a date
- `POST /api/meetings/book` - Book a meeting slot
- `POST /api/demo` - Submit demo request
- `POST /api/newsletter` - Subscribe to newsletter

### Admin Routes (Requires Authentication)
- `GET /api/meetings/requests` - Get all meeting requests
- `PUT /api/meetings/requests/:id/status` - Update meeting status
- `PUT /api/meetings/requests/:id` - Update meeting details
- `DELETE /api/meetings/requests/:id` - Delete meeting request
- `POST /api/meetings/slots` - Create meeting slots
- `DELETE /api/meetings/slots/:id` - Delete meeting slot
- `GET /api/demo` - Get all demo requests
- `GET /api/newsletter` - Get all newsletter subscribers

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Gmail account for email notifications

### Installation

1. Clone the repository:
```bash
git clone https://github.com/anilkumarsin329/FlowtelAIEBackend.git
cd FlowtelAIEBackend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/flowtelai
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=flowtel123
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/flowtelai` |
| `EMAIL_USER` | Gmail address for notifications | `your-email@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `your-app-password` |
| `ADMIN_USERNAME` | Admin username | `admin` |
| `ADMIN_PASSWORD` | Admin password | `flowtel123` |

## Email Configuration

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password for Gmail
3. Use the App Password in `EMAIL_PASS` environment variable

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

Set these in your deployment platform:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flowtelai
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

## Project Structure

```
src/
├── controllers/          # Route controllers
│   ├── demoController.js
│   ├── meetingController.js
│   └── newsletterController.js
├── middleware/           # Custom middleware
│   └── auth.js
├── models/              # MongoDB models
│   ├── Demo.js
│   ├── Meeting.js
│   └── Newsletter.js
├── routes/              # API routes
│   ├── demoRoutes.js
│   ├── meetingRoutes.js
│   └── newsletterRoutes.js
├── utils/               # Utility functions
│   └── emailService.js
└── server.js            # Main server file
```

## API Authentication

Admin routes require Basic Authentication:
- Username: `admin` (or your custom username)
- Password: `flowtel123` (or your custom password)

Example:
```javascript
const credentials = btoa('admin:flowtel123');
fetch('/api/meetings/requests', {
  headers: {
    'Authorization': `Basic ${credentials}`
  }
});
```

## Email Templates

The system sends automated emails for:
- **Booking Confirmation**: When a meeting is booked
- **Meeting Updates**: When date/time is changed
- **Cancellation**: When a meeting is cancelled

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@flowtelai.com or create an issue in this repository.