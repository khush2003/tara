// File: src/db.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/testing';

  try {
    await mongoose.connect(mongoURI);
    console.log(`Successfully connected to MongoDB at ${mongoURI}`);

    // Optional: Add event handlers for debugging
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', (error as Error).message);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
