import express, { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export default function (req: CustomRequest, res: Response, next: any) {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'Server error' });
    }
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
}