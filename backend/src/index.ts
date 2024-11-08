import { app } from './app.ts';
import { connectToMongo } from './middleware/connectMongo.ts';
import { job } from './cron/resetGameMinutes.ts';

const port = Bun.env.PORT || "3000";

export default {
  port: parseInt(port),
  fetch: app.fetch
};

await connectToMongo(Bun.env.MONGODB_URI || '');

job.start();