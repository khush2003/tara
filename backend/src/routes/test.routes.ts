import express from "express";
import { Request, Response } from 'express';
import verifyToken from "./verifyToken";
import { AuthenticatedRequest } from "./auth.routes";
const testRoutes = express()
testRoutes.use(express.json())

testRoutes.get('/testAccess', verifyToken, (req: AuthenticatedRequest, res) => {
    res.send(req.user);
    // IF user is not logged in, the middleware will return a 401 status code 
  });

export default testRoutes

