# DevConnect - Setup Instructions

## Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### 2. Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dev-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your values:
     ```env
     PORT=5000
     NODE_ENV=development
     BASE_URL=http://localhost:5000
     MONGO_DB_ATLAS=your-mongodb-connection-string
     SESSION_SECRET=your-secret-here
     ```

4. **Start the application**
   
   For development (with auto-restart):
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to http://localhost:5000

## Optional: OAuth Configuration

### GitHub OAuth (Optional)
1. Go to https://github.com/settings/developers
2. Create a new OAuth App
3. Set callback URL: `http://localhost:5000/auth/github/callback`
4. Add credentials to `.env`:
   ```env
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
   ```

### Google OAuth (Optional)
1. Go to https://console.cloud.google.com
2. Create credentials
3. Set callback URL: `http://localhost:5000/auth/google/callback`
4. Add credentials to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not configured yet)

## Project Structure

```
dev-connect/
├── config/          # Configuration files (database, passport)
├── models/          # Mongoose models
├── routes/          # Express routes
├── socket/          # Socket.io handlers
├── utils/           # Utility functions and middleware
├── views/           # EJS templates
├── public/          # Static files (CSS, JS, images)
├── app.js           # Main application file
└── package.json     # Dependencies and scripts
```

## Features

- User authentication (Local, GitHub, Google)
- Project creation and management
- Real-time chat using Socket.io
- Skill-based project recommendations
- Notifications system
- Task management
- Team collaboration

## Need Help?

- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
- Open an issue on GitHub for bugs or questions
