import { MiddlewareHandler } from 'hono';

import mongoose from 'mongoose';
import fs from 'fs';
import {MongoClient } from 'mongodb';

let conn: typeof mongoose;

export async function connectToMongo(uri: string): Promise<void> {
  try {
    if (conn) {
      return;
    }
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

export async function insertFromFile(client: typeof mongoose, jsonFilePath: string, collectionName: string): Promise<void> {

  try {
      // Read JSON file as string
      let jsonString = fs.readFileSync(jsonFilePath, 'utf8');

      // Remove all instances of "_id": { "$oid": <value> } and replace with "_id": <value>
      jsonString = jsonString.replace(/"_id":\s*\{\s*"\$oid":\s*"([^"]+)"\s*\}/g, '"_id": "$1"');
      

      
      // Parse the modified JSON string
      let jsonData = JSON.parse(jsonString);
      // convert "_id" : "<id>", convert the <id> from string to type ObjectId
      const convertObjectId = (obj: any) => {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
        if (key === '_id' && typeof obj[key] === 'string') {
          obj[key] = new mongoose.Types.ObjectId(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          convertObjectId(obj[key]);
        }
          }
        }
      };

      jsonData = jsonData.map((item: any) => {
        convertObjectId(item);
        return item;
      });


      // Read JSON file
      // let jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

      // jsonData = jsonData.map((item: any) => {
      //   if (item._id && item._id.$oid) {
      //     item._id = item._id.$oid;
      //   }
      //   return item;
      // });


      // Select the database and collection
      const database = client.connection.db
      const collection = database?.collection(collectionName);

      // Insert data
      const result = await collection?.insertMany(jsonData);
      console.log(`${result?.insertedCount} documents inserted.`);
  } catch (error) {
      console.error("Error inserting JSON data:", error);
  } 
}