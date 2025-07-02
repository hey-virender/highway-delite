import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.decode(token, { complete: true }) as any;
    const user = decoded?.payload;

    if (!user || !user.email) throw new Error('Invalid token');
    
    (req as any).user = user; 
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
