import { Hono } from '@hono/hono'
import mongoose from 'mongoose';

import { jwt } from '@hono/hono/jwt'
import type { JwtVariables } from '@hono/hono/jwt'

import userRoutes from "./routes/users.ts";
import authRoutes from "./routes/auth.ts";

type Variables = JwtVariables

const port = Deno.env.get('PORT') || '3000'
const app = new Hono<{ Variables: Variables }>()

// For logging and seeing the time taken for each request and response cycle
// import { logger } from '@hono/hono/logger'
// app.use('*', logger())

export const jwtMiddleware = jwt({
  secret: Deno.env.get('JWT_SECRET') || 'secret',
})


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




app.notFound((c) => {
  return c.text('404 Page or API Not Found', 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text(`An Error has occured!: ${err}`, 500)
})


// Routes

const apiRoutes = app.basePath('/api/v1')
.route('/users', userRoutes)
.route('/auth', authRoutes)

Deno.serve({
  port: parseInt(port),
}, app.fetch)

export type ApiRoutes = typeof apiRoutes

