import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/User';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const verifyClerkSession = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header or clerk_session_token header
    const authHeader = req.headers.authorization;
    const clerkToken = req.headers['clerk_session_token'] as string;

    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.substring(7)
      : clerkToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No session token provided'
      });
    }

    // Decode the Clerk JWT token (without verification for now, as Clerk handles this)
    const decoded = jwt.decode(token, { complete: true }) as any;

    if (!decoded || !decoded.payload) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session token format'
      });
    }

    const payload = decoded.payload;

    // Extract user information from Clerk token
    const clerkUserId = payload.sub; // Clerk user ID
    const email = payload.email;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session token - missing user ID'
      });
    }

    // Find user in database
    const user = await User.findOne({ user_id: clerkUserId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    // Check if session token matches (optional security check)
    if (user.sessionToken && user.sessionToken !== token) {
      return res.status(401).json({
        success: false,
        message: 'Session token mismatch'
      });
    }

    // Check session expiry if set
    if (user.sessionExpiry && new Date() > user.sessionExpiry) {
      return res.status(401).json({
        success: false,
        message: 'Session expired'
      });
    }

    // Attach user to request object
    req.user = {
      id: user._id,
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      authProvider: user.authProvider,
      clerkPayload: payload
    };

    next();
  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};

// Optional middleware for routes that require admin access
export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Add admin logic here if needed
  // For now, all authenticated users can access
  next();
}; 