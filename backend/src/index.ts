import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db'; // Adjust path if necessary
import authRoutes from './routes/auth.routes'; // Adjust path if necessary

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware to log requests
app.use((req: Request, res: Response, next) => {
  console.log(`Received request for: ${req.method} ${req.url}`);
  next();
});

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
app.use('/auth', authRoutes); // Ensure this line is present

// Root route for testing connection
app.get('/', (req: Request, res: Response) => {
  res.send('Server is up and running!');
});

// Start the server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`Routes registered: /auth/login`);
});
