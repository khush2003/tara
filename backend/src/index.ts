import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes'; // Adjust path if necessary
import connectDB from './config/db';
import testRoutes from './routes/test.routes';
import guestSessionRoutes from './routes/guestSession.routes';
import learningRoutes from './routes/learning.routes';
import performanceRecordRoutes from './routes/performanceRecords.routes';
import classroomRoutes from './routes/classRoom.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB()
  .then(() => {
    // console.log('MongoDB connection established.');
  })
  .catch((err) => {
    console.error('Failed to establish MongoDB connection:', err.message);
    process.exit(1);
  });

// Register routes
app.use('/auth', authRoutes);

// Register test routes
app.use('/test', testRoutes);

// Guest session routes
app.use('/guest', guestSessionRoutes);

// Learning module routes
app.use('/learning', learningRoutes);

// Performance record routes
app.use('/performance', performanceRecordRoutes);

// Classrooms routes
app.use('/classroom', classroomRoutes);

// Start the server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
