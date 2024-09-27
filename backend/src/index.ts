import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes'; // Adjust path if necessary
import connectDB from './config/db';
import testRoutes from './routes/test.routes';

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

// Start the server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
