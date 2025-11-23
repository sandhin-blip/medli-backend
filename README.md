# Medli Health Tracking Backend API

A comprehensive Node.js/Express backend API for the Medli health tracking application with user authentication, cough recording management, risk assessments, and lifestyle tracking.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Health Data Management**: Store and manage cough recordings, risk assessments, and habits
- **Security**: Helmet security headers, CORS, rate limiting, input validation
- **RESTful API**: Clean and consistent API endpoints
- **MongoDB**: Scalable NoSQL database with Mongoose ODM

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR use MongoDB Atlas (cloud) - [Sign up free](https://www.mongodb.com/cloud/atlas/register)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

## 🛠️ Installation & Setup

### 1. Clone or Navigate to Project

```bash
cd medli-backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- helmet
- express-rate-limit
- express-validator
- nodemon (dev dependency)

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/medli

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medli

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-64-characters-long-change-this
JWT_EXPIRE=24h

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

**Important**: Generate a strong JWT secret! You can use:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Start MongoDB

**For local MongoDB:**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# OR
mongod
```

**For MongoDB Atlas:**
- No local setup needed
- Just update `MONGODB_URI` in `.env` with your Atlas connection string

### 5. Run the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════╗
║                                            ║
║     🫁  MEDLI HEALTH API SERVER  🫁        ║
║                                            ║
║  Server running in development mode        ║
║  Port: 5000                                ║
║  API: http://localhost:5000/api            ║
║                                            ║
╚════════════════════════════════════════════╝

✅ MongoDB Connected: localhost
📊 Database Name: medli
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

#### Delete Account
```http
DELETE /api/auth/account
Authorization: Bearer YOUR_JWT_TOKEN
```

### Health Data Endpoints

All health data endpoints require authentication (Bearer token).

#### Add Recording
```http
POST /api/health/recording
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "duration": 2.5,
  "intensity": "Moderate",
  "pattern": "Dry/Sharp",
  "intensityScore": 65,
  "date": "1/1/2025",
  "time": "10:30:00 AM"
}
```

#### Get All Recordings
```http
GET /api/health/recordings
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Delete Recording
```http
DELETE /api/health/recording/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Save Risk Assessment
```http
POST /api/health/risk-assessment
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "riskLevel": "Low Risk",
  "percentage": 25,
  "score": 15,
  "questions": {...},
  "answers": {...}
}
```

#### Get Risk Assessment
```http
GET /api/health/risk-assessment
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Save Habits
```http
POST /api/health/habits
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "sleep": 7,
  "exercise": 150,
  "water": 8,
  "stress": 3,
  "smoking": false
}
```

#### Get Habits
```http
GET /api/health/habits
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Dashboard
```http
GET /api/health/dashboard
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Export All Data
```http
GET /api/health/export
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🧪 Testing with Postman or cURL

### Using cURL

**1. Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**2. Login and get token:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**3. Use token to access protected routes:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**4. Add a recording:**
```bash
curl -X POST http://localhost:5000/api/health/recording \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"duration":2.5,"intensity":"Moderate","pattern":"Dry"}'
```

### Using Postman

1. Import the API into Postman
2. Set base URL: `http://localhost:5000/api`
3. For protected routes:
   - Go to Authorization tab
   - Select "Bearer Token"
   - Paste your JWT token

## 📁 Project Structure

```
medli-backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── healthDataController.js  # Health data logic
├── middleware/
│   └── authMiddleware.js    # JWT verification
├── models/
│   ├── User.js             # User schema
│   └── HealthData.js       # Health data schema
├── routes/
│   ├── auth.js             # Auth routes
│   └── healthData.js       # Health data routes
├── .env                    # Environment variables (DO NOT COMMIT)
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
├── README.md            # This file
└── server.js           # Main entry point
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator on all endpoints
- **Rate Limiting**:
  - 100 requests/15min for general API
  - 5 attempts/15min for auth endpoints
- **Helmet**: Security HTTP headers
- **CORS**: Configurable cross-origin access
- **Error Handling**: Safe error messages (no sensitive info leakage)

## 🚢 Deployment

### Environment Setup for Production

1. Update `.env`:
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret-64-chars-min
CLIENT_URL=https://your-frontend-domain.com
```

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login

# Create Heroku app
heroku create medli-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
heroku config:set JWT_EXPIRE=24h

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

### Deploy to Railway/Render

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

### Deploy to DigitalOcean/AWS

Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name medli-api
pm2 save
pm2 startup
```

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check MONGODB_URI in `.env`
- For Atlas: Whitelist your IP address

**Port Already in Use:**
- Change PORT in `.env`
- Or kill the process: `lsof -ti:5000 | xargs kill` (Mac/Linux)

**JWT Token Error:**
- Ensure JWT_SECRET is set in `.env`
- Check token expiration time

**CORS Error:**
- Update CLIENT_URL in `.env` to match your frontend URL

## 📝 License

ISC License - Feel free to use this for your projects!

## 👥 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ by Medli Health Tech**
