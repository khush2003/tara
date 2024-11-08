import { MiddlewareHandler } from 'hono';

import mongoose from 'mongoose';

let conn: typeof mongoose;

export async function connectToMongo(uri: string): Promise<void> {
  try {
    conn = await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas, Database: ', conn.connection.name);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

export const connectMongoMiddleware: MiddlewareHandler = async (_c, next) => {
  const MONGODB_URI = Bun.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  await connectToMongo(MONGODB_URI);
  await next();
};