# HD Notes Application

<div align="center">

![HD Notes](https://img.shields.io/badge/HD-Notes-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

A modern full-stack notes application with advanced authentication and seamless user experience.

[Live Demo](https://highway-delite-six.vercel.app/) • [API Documentation](#api-endpoints) • [Contributing](#contributing)

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Frontend Setup](#-frontend-setup)
- [Backend Setup](#-backend-setup)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication
- **Multi-provider Authentication**: Email/OTP and Google OAuth
- **Clerk Integration**: Secure authentication with session management
- **Automatic Account Linking**: Links accounts with same email across providers
- **Protected Routes**: Role-based access control

### 📝 Notes Management
- **CRUD Operations**: Create, read, update, and delete notes
- **Real-time Updates**: Instant note synchronization
- **User Isolation**: Secure user-specific note storage
- **Rich Text Support**: Formatted note content

### 🎨 User Experience
- **Responsive Design**: Mobile-first Tailwind CSS design
- **Modern UI**: Clean, intuitive interface
- **Toast Notifications**: Real-time user feedback
- **Form Validation**: Comprehensive client-side and server-side validation
- **Error Handling**: Graceful error handling with user-friendly messages

### 🔧 Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **Modern React**: Hooks, Context API, and functional components
- **Optimized Builds**: Production-ready with error suppression for deployment
- **CORS Configuration**: Secure cross-origin resource sharing
- **Environment Management**: Separate dev/prod configurations

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.0
- **Styling**: Tailwind CSS 4.1
- **Authentication**: Clerk React
- **Routing**: React Router DOM 7.6
- **HTTP Client**: Axios
- **Form Validation**: Zod
- **Notifications**: Sonner
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Additional Storage**: Supabase
- **Authentication**: JWT + Clerk verification
- **Validation**: Custom middleware
- **CORS**: Configured for secure cross-origin requests

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint, TypeScript
- **Development**: Nodemon, ts-node
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB database
- Clerk account for authentication

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hd
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**
```bash
# Backend environment (.env)
cd ../backend
cp .env.example .env
# Fill in your environment variables

# Frontend environment (.env)
cd ../frontend
cp .env.example .env
# Fill in your Clerk keys
```

4. **Run the application**
```bash
# Terminal 1: Start backend (from backend directory)
npm run dev

# Terminal 2: Start frontend (from frontend directory)
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## 📁 Project Structure

```
hd/
├── backend/                 # Express.js API server
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Authentication & validation
│   ├── model/             # MongoDB schemas
│   ├── routes/            # API routes
│   ├── server.ts          # Main server file
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── schemas/       # Validation schemas
│   │   ├── types/         # TypeScript types
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static assets
│   ├── vite.config.ts     # Vite configuration
│   └── package.json
└── README.md
```

## 🎨 Frontend Setup

### Development Server
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Build Options
```bash
npm run build          # Standard build (deployment-ready)
npm run build:check    # Build with TypeScript checking
npm run build:prod     # Production build with optimizations
npm run build:force    # Force build ignoring cache
```

### Key Components
- **AuthGuard**: Redirects authenticated users from public routes
- **ProtectedRoute**: Protects authenticated routes
- **CreateNoteModal**: Modal for creating/editing notes
- **NoteSection**: Displays user's notes with CRUD operations

### Environment Variables (.env)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🔧 Backend Setup

### Development Server
```bash
cd backend
npm run dev          # Start with nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server
```

### Environment Variables (.env)
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Database Models
- **User**: Stores user information and authentication details
- **Note**: Stores user notes with content and metadata

## 🔗 API Endpoints

### Authentication Routes
```
POST /api/user/create     # Create/update user (supports OAuth)
POST /api/user/login      # User login
POST /api/user/logout     # User logout
GET  /api/user/profile    # Get user profile (protected)
GET  /api/user/:user_id   # Get user by ID (protected)
```

### Notes Routes
```
GET    /api/note/user/:user_id    # Get user's notes (protected)
POST   /api/note/create           # Create new note (protected)
PUT    /api/note/update/:note_id  # Update note (protected)
DELETE /api/note/delete/:note_id  # Delete note (protected)
```

### Request Examples

#### Create User
```bash
curl -X POST http://localhost:8000/api/user/create \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "clerk_user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "authProvider": "email",
    "sessionToken": "clerk_session_token"
  }'
```

#### Create Note
```bash
curl -X POST http://localhost:8000/api/note/create \
  -H "Content-Type: application/json" \
  -H "clerk_session_token: your_session_token" \
  -d '{
    "title": "My Note",
    "content": "Note content here",
    "user_id": "clerk_user_id"
  }'
```

## 🔐 Authentication

### Authentication Flow
1. **User Registration/Login**: Via Clerk (email/OTP or Google OAuth)
2. **Session Creation**: Clerk provides session token
3. **Backend Verification**: Custom middleware verifies Clerk session
4. **User Creation**: Backend creates/updates user record
5. **Protected Access**: Session token required for protected routes

### Google OAuth Integration
- Seamless Google sign-in integration
- Automatic account linking for existing email addresses
- Handles new user creation and existing user authentication

### Session Management
- Clerk handles session lifecycle
- Custom backend middleware for API protection
- Automatic session refresh and validation

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Production build
npm run build

# Deploy to Vercel
vercel --prod
```

### Backend (Railway/Heroku)
```bash
# Build for production
npm run build

# Set environment variables on your platform
# Deploy using your preferred method
```

### Environment Setup
- Configure CORS origins for production URLs
- Update API base URLs in frontend
- Set up production MongoDB cluster
- Configure Clerk for production domain

### Build Configuration
The project is configured to ignore TypeScript and ESLint errors during deployment builds:
- Use `npm run build` for deployment
- Fallback options available if build fails
- See [DEPLOYMENT.md](frontend/DEPLOYMENT.md) for detailed instructions

## 📚 Additional Documentation

- **[Setup Guide](SETUP.md)** - Detailed step-by-step setup instructions
- **[API Documentation](API.md)** - Complete API reference with examples
- **[Contributing Guide](CONTRIBUTING.md)** - Development standards and workflow
- **[Frontend Deployment Guide](frontend/DEPLOYMENT.md)** - Build configuration and deployment

### Quick Links
- [Environment Variables Setup](SETUP.md#environment-setup)
- [Common Issues & Solutions](SETUP.md#common-issues)
- [API Request Examples](API.md#request-examples)
- [Development Standards](CONTRIBUTING.md#development-standards)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure code passes linting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Clerk](https://clerk.dev/) for authentication services
- [Vercel](https://vercel.com/) for hosting
- [MongoDB](https://www.mongodb.com/) for database services
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you have any questions or need support, please:
- Open an issue on GitHub
- Check the documentation
- Review existing issues and discussions

---

<div align="center">
Made with ❤️ using React, Node.js, and TypeScript
</div> 