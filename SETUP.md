# Setup Guide

This guide will help you set up the HD Notes application locally for development.

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation or Atlas account) - [Get started here](https://www.mongodb.com/)
- **Clerk Account** - [Sign up here](https://clerk.dev/)
- **Git** - [Download here](https://git-scm.com/)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd hd
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Create Backend Environment File

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=8000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hd-notes
# Or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/hd-notes

# Authentication
CLERK_SECRET_KEY=your_clerk_secret_key_here
JWT_SECRET=your_super_secret_jwt_key_here

# Supabase Configuration (Optional)
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# Environment
NODE_ENV=development

# CORS Origins (comma-separated)
FRONTEND_URL=http://localhost:5173,http://127.0.0.1:5173
```

#### Getting Your Clerk Secret Key

1. Go to [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Select your application
3. Go to **API Keys** section
4. Copy the **Secret Key** (starts with `sk_`)

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### Create Frontend Environment File

Create a `.env` file in the `frontend` directory with the following variables:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Environment
VITE_NODE_ENV=development

# Build Configuration (Optional)
SKIP_PREFLIGHT_CHECK=true
CI=false
GENERATE_SOURCEMAP=false
```

#### Getting Your Clerk Publishable Key

1. Go to [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Select your application
3. Go to **API Keys** section
4. Copy the **Publishable Key** (starts with `pk_`)

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   
   # On Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `MONGODB_URI` in your backend `.env` file

### 5. Clerk Configuration

#### Setup Authentication Methods

1. In Clerk Dashboard, go to **User & Authentication > Email, Phone, Username**
2. Enable **Email address** and **Email verification code**
3. Go to **User & Authentication > Social Connections**
4. Enable **Google** OAuth provider

#### Configure Domains

1. Go to **Domains** section
2. Add your development domains:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`

#### Setup Redirect URLs

1. Go to **Paths** section
2. Configure redirect URLs:
   - Sign-in: `/login`
   - Sign-up: `/signup`
   - Dashboard: `/dashboard`

### 6. Run the Application

#### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

The backend will start on http://localhost:8000

#### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will start on http://localhost:5173

### 7. Verify Setup

1. Open http://localhost:5173 in your browser
2. Try signing up with an email
3. Check that you receive an OTP email
4. Verify login functionality
5. Test creating a note
6. Test Google OAuth (if configured)

## Common Issues

### MongoDB Connection Issues

- **Error**: `MongoServerError: bad auth`
  - **Solution**: Check your MongoDB URI credentials

- **Error**: `MongooseError: Operation buffering timed out`
  - **Solution**: Ensure MongoDB is running and accessible

### Clerk Authentication Issues

- **Error**: `Clerk: Missing publishable key`
  - **Solution**: Check your `VITE_CLERK_PUBLISHABLE_KEY` in frontend `.env`

- **Error**: `Invalid API key`
  - **Solution**: Verify your Clerk secret key in backend `.env`

### CORS Issues

- **Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`
  - **Solution**: Ensure frontend URL is in backend CORS configuration

### Build Issues

If you encounter TypeScript or ESLint errors during build:

```bash
# Use deployment-friendly build commands
npm run build          # Ignores TS/ESLint errors
npm run build:force    # Force build if issues persist
```

## Development Tips

### Hot Reloading

Both frontend and backend support hot reloading:
- Frontend: Changes auto-refresh the browser
- Backend: Nodemon restarts the server on file changes

### Debugging

#### Frontend Debugging
- Open browser DevTools (F12)
- Check Console for errors
- Use React DevTools extension

#### Backend Debugging
- Check terminal output for errors
- Use `console.log()` for debugging
- Check MongoDB logs if database issues

### Testing API Endpoints

Use tools like Postman or curl to test API endpoints:

```bash
# Test user creation
curl -X POST http://localhost:8000/api/user/create \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","email":"test@example.com","name":"Test User"}'
```

## Next Steps

- Read the [API Documentation](README.md#api-endpoints)
- Check the [Deployment Guide](frontend/DEPLOYMENT.md)
- Explore the [Contributing Guidelines](README.md#contributing)

## Getting Help

If you encounter issues:
1. Check this setup guide
2. Review the main [README.md](README.md)
3. Check existing GitHub issues
4. Create a new issue with detailed error information 