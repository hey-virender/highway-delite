import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectDB';
import userRoutes from './routes/user.routes';
import noteRoutes from './routes/note.routes';

dotenv.config();

const app = express();

connectDB();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'https://highway-delite-six.vercel.app/', //actual frontend
    
  ],
  credentials: true, // Allow cookies/auth headers
  optionsSuccessStatus: 200, // Support legacy browsers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'clerk_session_token', // Allow custom Clerk session token header
  ],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/note', noteRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

