import express, { Express, Request, Response } from 'express';
import postRoutes from './post.js';
import getRoutes from './get.js';
import putRoutes from './put.js';
import deleteRoutes from './delete.js';


import cors from 'cors';

const app: Express = express();
const port: number = 8080; //Put this in .env file when building code for production
const hostname = '127.0.0.1'; // Using this url for testing purposes (same as localhost), this supports android emulator when paired with 10.0.2.2


app.use(cors());


app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Tara Backend!');
});


app.use('/post', postRoutes)
app.use('/get', getRoutes)
app.use('/put', putRoutes)
app.use('/delete', deleteRoutes)

app.listen(port, hostname, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});