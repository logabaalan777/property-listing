import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/authmiddleware';
import redisClient from '../config/redis';

const JWT_SECRET = process.env.JWT_SECRET!;

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // First, check Redis for cached email (prevent duplicate registration)
    const cachedUser = await redisClient.get(`user:email:${email}`);
    if (cachedUser) {
      return res.status(400).json({ message: 'Email already exists (cached)' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await redisClient.setEx(`user:email:${email}`, 600, 'exists'); // Cache for 10 minutes
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    // Optional: Cache newly registered user
    await redisClient.setEx(
      `session:user:${newUser._id}`,
      3600,
      JSON.stringify({ id: newUser._id, name, email }) // cache for 1 hour
    );

    res.status(201).json({ user: { id: newUser._id, name, email }, token });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Cache the login session (user + token) — Optional
    await redisClient.setEx(
      `session:user:${user._id}`,
      3600,
      JSON.stringify({ id: user._id, name: user.name, email, token })
    );

    res.json({ user: { id: user._id, name: user.name, email }, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user profile', error: err });
  }
};