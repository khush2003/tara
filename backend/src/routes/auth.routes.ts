import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model'; // Adjust the path if necessary
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import verify from './verifyToken';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string;
}

dotenv.config();

const router = express.Router();

// Register a new Student
router.post('/registerStudent', async (req: Request, res: Response) => {
  const { name, email, password, profile_picture } = req.body;

  
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    try {
      const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        role: 'student',
        profile_picture: profile_picture? profile_picture : 'https://via.placeholder.com/150',
        student_details: {
          game_points: 0,
          game_hours_left: 60
        }
      });
      await newUser.save();
      const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'Server error' });
    }

    const token = jwt.sign({ _id: newUser._id }, JWT_SECRET);

    res.header('auth-token', token).status(201).json({
      message: 'Register successful',
      token,
      user_id: newUser._id, 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Some error with the provided user details or something wrong with the server' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist! Please register first!' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create a JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'Server error' });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    res.header('auth-token', token).json({
      message: 'Login successful',
      token,
      user_id: user._id, // Include username in response
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/me', verify, async (req: AuthenticatedRequest, res: Response) => {
  try {
      const user = await User.findById((req.user as JwtPayload)._id);
      res.json({"response": "success"});
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
});

export default router;
