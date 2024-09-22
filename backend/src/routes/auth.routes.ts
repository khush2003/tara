import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model'; // Adjust the path if necessary
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  console.log('Login request received:', req.body); // Log the incoming request

  const { email, password } = req.body;

  try {
    console.log('Searching for user with email:', email);
    const user = await User.findOne({ email });

    if (!user) {
      console.warn('Invalid email:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('User found, verifying password...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn('Invalid password for email:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('Password verified, generating token...');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    
    console.log('Login successful for user:', email);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Export the router
export default router;
