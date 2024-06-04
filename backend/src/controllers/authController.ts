import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { logError } from '../utils/logger';

const JWT_SECRET = 'filler_content'; // Should be in environment variables

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password, token: '' });
    user.token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '365d' });
    await user.save();
    res.status(201).send({ token: user.token });
  } catch (error) {
    logError(`Registration error: ${error.message}`);
    res.status(500).send('Error registering user');
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).send('Invalid credentials');
    }
    user.token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '365d' });
    await user.save();
    res.send({ token: user.token });
  } catch (error) {
    logError(`Login error: ${error.message}`);
    res.status(500).send('Error logging in user');
  }
};
