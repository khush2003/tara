// File: src/db.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  try {
    const conn = await mongoose.connect(mongoURI!);
    console.log('MongoDB connected:', conn.connection.host);

  } catch (error) {
    console.error('Error connecting to MongoDB:', (error as Error).message);
    process.exit(1); // Exit process on failure
    // 1 means failure and 0 means success
  }
};

export default connectDB;
