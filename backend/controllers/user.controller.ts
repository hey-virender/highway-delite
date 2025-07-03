import User from '../model/User';
import { Request, Response } from 'express';

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    console.log('Creating/updating user:', userData);

    // First check if user exists by Clerk user_id
    let userExist = await User.findOne({ user_id: userData.user_id });

    if (userExist) {
      // User exists with same Clerk ID - update session and auth provider if needed
      if (userData.sessionToken) {
        userExist.sessionToken = userData.sessionToken;
        userExist.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        userExist.isActive = true;

        // Update auth provider if it's different (e.g., user previously used email, now using Google)
        if (userData.authProvider && userExist.authProvider !== userData.authProvider) {
          userExist.authProvider = userData.authProvider;
          console.log(`Updated auth provider from ${userExist.authProvider} to ${userData.authProvider}`);
        }

        await userExist.save();
      }
      return res.status(200).json({
        success: true,
        message: 'User session updated',
        user: userExist
      });
    }

    // Check if user exists by email (to handle different auth providers for same email)
    const emailExist = await User.findOne({ email: userData.email });

    if (emailExist) {
      // User exists with same email but different Clerk ID (different auth provider)
      // Update the existing user with new Clerk ID and auth provider
      emailExist.user_id = userData.user_id; // Update to new Clerk ID
      emailExist.authProvider = userData.authProvider; // Update auth provider
      emailExist.sessionToken = userData.sessionToken;
      emailExist.sessionExpiry = userData.sessionToken
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : undefined;
      emailExist.isActive = true;

      // Update other fields if provided
      if (userData.name) emailExist.name = userData.name;
      if (userData.image) emailExist.image = userData.image;

      await emailExist.save();

      console.log(`Updated existing user with email ${userData.email} to use ${userData.authProvider} auth provider`);

      return res.status(200).json({
        success: true,
        message: 'User auth provider updated and logged in',
        user: emailExist
      });
    }

    // No existing user found - create new user
    const sessionExpiry = userData.sessionToken
      ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      : undefined;

    const newUser = await User.create({
      user_id: userData.user_id,
      email: userData.email,
      image: userData.image || '',
      authProvider: userData.authProvider,
      name: userData.name,
      dob: userData.dob,
      sessionToken: userData.sessionToken,
      sessionExpiry: sessionExpiry,
      isActive: true,
    });

    console.log('Created new user:', newUser.email);

    res.status(201).json({
      success: true,
      message: 'New user created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ user_id });
    if (!user) return res.status(404).json({
      success: false,
      message: 'User not found'
    });
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log(error as Error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Login endpoint - store session token
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { user_id, sessionToken } = req.body;

    if (!user_id || !sessionToken) {
      return res.status(400).json({
        success: false,
        message: 'User ID and session token are required'
      });
    }

    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user session
    user.sessionToken = sessionToken;
    user.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    user.isActive = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.log(error as Error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout endpoint - clear session token
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Clear session
    user.sessionToken = undefined;
    user.sessionExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.log(error as Error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user profile (protected route)
export const getProfile = async (req: any, res: Response) => {
  try {
    // User is attached by middleware
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.log(error as Error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};