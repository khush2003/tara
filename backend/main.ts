import { Hono } from '@hono/hono'
import mongoose from 'mongoose';

import userRoutes from "./routes/user.ts";
import authRoutes, { jwtMiddleware } from "./routes/auth.ts";
import { unitRoutes } from "./routes/unit.ts";
import { classroomRoutes } from "./routes/classroom.ts";
import { pointslogRoutes } from "./routes/pointslog.ts";


const port = Deno.env.get('PORT') || '3000'
const app = new Hono()

// For logging and seeing the time taken for each request and response cycle
// import { logger } from '@hono/hono/logger'
// app.use('*', logger())

// MongoDB connection
let conn: typeof mongoose;

// Connect to MongoDB
async function connectToMongo(uri: string): Promise<void> {
  try {
    conn = await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas, Database: ", conn.connection.name);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    Deno.exit(1);
  }
}

// Middleware to connect to MongoDB
app.use("*", async (_c, next) => {
  const MONGODB_URI = Deno.env.get('MONGODB_URI');
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }
  if (!conn) {
    await connectToMongo(MONGODB_URI);
  }

  await next();
});


app.use("/api/v1/user/*", jwtMiddleware);
// TODO: Other routes that require authentication


app.notFound((c) => {
  return c.text('404 Page or API Not Found', 404)
})



// Routes

const apiRoutes = app.basePath('/api/v1')
.route('/user', userRoutes)
.route('/auth', authRoutes)
.route('/unit', unitRoutes)
.route('/classroom', classroomRoutes)
.route('pointslog', pointslogRoutes)

Deno.serve({
  port: parseInt(port),
}, app.fetch)

export type ApiRoutes = typeof apiRoutes

