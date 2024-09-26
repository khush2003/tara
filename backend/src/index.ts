import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db'; // Adjust path if necessary
import authRoutes from './routes/auth.routes'; // Adjust path if necessary

dotenv.config();
console.log('All Environment Variables:', process.env);
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log to verify it's loaded

const app: Express = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('MongoDB connection established.');
  })
  .catch((err) => {
    console.error('Failed to establish MongoDB connection:', err.message);
    process.exit(1);
  });

// Register routes
app.use('/auth', authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`Routes registered: /auth/login`);
});
