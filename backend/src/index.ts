import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeFirebase } from './config/firebase';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
initializeFirebase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Lab Component Management API is running' });
});

// Import routes
import semesterRoutes from './routes/semesterRoutes';
import componentRoutes from './routes/componentRoutes';
import issueRoutes from './routes/issueRoutes';

// app.use('/api/labs', labRoutes);
// app.use('/api/batches', batchRoutes);

app.use('/api/semesters', semesterRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/issues', issueRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
