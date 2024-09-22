import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model'; // Adjust the path if necessary
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'Server error' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      username: user.username, // Include username in response
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', async (req: Request, res: Response) => {
  console.log('Received request for profile');

  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token:', token); // Log the token

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    console.log('JWT Secret:', JWT_SECRET); // Log the JWT secret (for debugging only, be careful with this in production)

    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload; // Cast to JwtPayload
    console.log('Decoded token:', decoded); // Log the decoded token

    const user = await User.findById(decoded.userId).select('-password'); // Exclude password
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the user data retrieved from the database
    console.log('User data retrieved from database:', user);

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update user profile

router.put('/profile', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  console.log('Received request to update profile'); // Log the request

  if (!token) {
    console.log('No token provided'); // Log missing token
    return res.status(401).json({ message: 'No token provided' });
  }

  const { firstName, lastName, email, password } = req.body;
  console.log('Request body:', req.body); // Log the request body

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload; // Cast to JwtPayload

    console.log('Decoded user ID from token:', decoded.userId); // Log decoded user ID

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('User not found'); // Log if user is not found
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if they are provided
    if (firstName) {
      user.firstName = firstName;
      console.log('Updated first name:', firstName); // Log first name update
    }
    if (lastName) {
      user.lastName = lastName;
      console.log('Updated last name:', lastName); // Log last name update
    }
    if (email) {
      user.email = email;
      console.log('Updated email:', email); // Log email update
    }

    // Update password only if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Hash the new password
      console.log('Updated password'); // Log password update
    }

    await user.save(); // Save the updated user
    console.log('Profile updated successfully'); // Log success message
    res.json({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('Update profile error:', error); // Log error details
    res.status(500).json({ message: 'Server error' });
  }
});

// Export the router
export default router;
