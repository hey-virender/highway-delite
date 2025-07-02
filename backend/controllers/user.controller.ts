import User from '../model/User';
import { Request, Response } from 'express';

export const createUser = async (req:Request, res:Response) => {
try {
  const supaUser = req.body;
  const userExist = await User.findOne({user_id:supaUser.sub});
  if(userExist) return res.status(200).json({message: 'User already exists'});
  const newUser = await User.create({
    user_id: supaUser.sub,
    email: supaUser.email,
    image: supaUser.picture,
    authProvider: supaUser.app_metadata.provider,
    name: supaUser.user_metadata.name,
    dob: supaUser.user_metadata.dob,
  });
  res.status(201).json({message: 'User created successfully', user: newUser});
} catch (error) {
  console.log(error as Error);
  res.status(500).json({message: 'Internal server error'});
}

}

export const getUser = async (req:Request, res:Response) => {
  try {
    const {user_id} = req.params;
    const user = await User.findOne({user_id});
    if(!user) return res.status(404).json({message: 'User not found'});
    res.status(200).json({user});
  } catch (error) {
    console.log(error as Error);
  }
}