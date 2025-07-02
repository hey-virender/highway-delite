import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB';
import userRoutes from './routes/user.routes';
import noteRoutes from './routes/note.routes';

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/note', noteRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

