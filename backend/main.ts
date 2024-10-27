import { Hono, type Env, type MiddlewareHandler } from '@hono/hono'
import mongoose from 'mongoose';
import userRoutes from "./routes/user.ts";
import authRoutes, { jwtMiddleware } from "./routes/auth.ts";
import { unitRoutes } from "./routes/unit.ts";
import { classroomRoutes } from "./routes/classroom.ts";
import { pointslogRoutes } from "./routes/pointslog.ts";
import { secureHeaders } from '@hono/hono/secure-headers'
import { apiReference } from '@scalar/hono-api-reference'
import openapi from "./openapi.json" with { type: "json" }

const port = Deno.env.get('PORT') || '3000'
const app = new Hono()

import { logger } from '@hono/hono/logger'
app.use('*', logger())

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

app.use(secureHeaders())

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
app.use("/api/v1/classroom/*", jwtMiddleware);


app.notFound((c) => {
  return c.text('404 Page or API Not Found', 404)
})

app.get("/api/v1", (c) => {
  return c.text('Welcome to the API of the Student Portal', 200)
})

app.get("/api/v1/reference", apiReference({
  theme: "saturn",
  spec: {
    url: 'openapi.json',
  }
}) as unknown as MiddlewareHandler<Env>)

// Routes


app.get("/openapi.json", (c) => {
  return c.json(openapi)
})

app.get("api/v1/openapi.json", (c) => {
  return c.json(openapi)
})

app.get("/reference", apiReference({
  theme: "alternate",
  spec: {
    url: 'openapi.json',
  }
}) as unknown as MiddlewareHandler<Env>)

const apiRoutes = app.basePath('/api/v1')
.route('/user', userRoutes)
.route('/auth', authRoutes)
.route('/unit', unitRoutes)
.route('/classroom', classroomRoutes)
.route('pointslog', pointslogRoutes)

Deno.serve({
  port: parseInt(port),
}, app.fetch)

type ApiRoutes = typeof apiRoutes

await connectToMongo(Deno.env.get('MONGODB_URI') || '');

// TODO: Future, sign certs with CA and use HTTPS


// Script in order to reset the game minutes of all users to 60 every day
// ----------------------------------------------------------------
import { User } from "./models/user.model.ts";

// Create a queue for resetting game minutes
const resetQueue = await Deno.openKv();

// Processor function to handle the job
resetQueue.listenQueue(async (job) => {
    const { userIds } = job.data;
    await User.updateMany({ _id: { $in: userIds } }, { $set: { 'game_profile.game_minutes_left': 60 } });
    console.log(`Updated ${userIds.length} users`);
});

// Function to enqueue batches
async function enqueueGameResetInBatches(batchSize: number) {
  console.log('Starting batch job to reset game minutes');
    let usersProcessed = 0;

    while (true) {
        const users = await User.find().skip(usersProcessed).limit(batchSize);

        if (users.length === 0) break;

        const userIds = users.map(user => user._id);
        await resetQueue.enqueue({ data: userIds });

        usersProcessed += users.length;
        console.log(`Enqueued ${usersProcessed} users`);
    }
}

// Schedule the batch job to run every day at midnight
Deno.cron( "Resetting game minutes for all users" , '0 0 * * *', () => {
  console.log('Scheduled job to reset game minutes started');
  enqueueGameResetInBatches(1000);
});
// ----------------------------------------------------------------
export { apiRoutes };
export type { ApiRoutes };
