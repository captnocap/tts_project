import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { logError } from '../utils/logger';

const JWT_SECRET = 'your_jwt_secret'; // Should be in environment variables

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Access denied');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).send('Invalid token');
    }
    req.user = user;
    next();
  } catch (error) {
    logError(`Authentication error: ${error.message}`);
    res.status(401).send('Invalid token');
  }
};
