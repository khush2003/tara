import mongoose from "mongoose";
import { connectToMongo, insertFromFile,  } from "./middleware/connectMongo.ts";

const MONGODB_URI = Bun.env.MONGODB_URI;
if (!MONGODB_URI) {
throw new Error('MONGODB_URI is not defined in environment variables');
}
try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas, Database: ', conn.connection.name);
    await insertFromFile(conn, "./dev.units.json", "units");
    console.log("Uploaded Course Data to Database!");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }

process.exit(0);
