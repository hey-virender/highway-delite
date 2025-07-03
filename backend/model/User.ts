import mongoose from 'mongoose';

interface IUser {
  _id?: string;
  user_id: string;
  name: string;
  dob: Date;
  email: string;
  image?: string,
  authProvider: string,
  sessionToken?: string,
  sessionExpiry?: Date,
  isActive?: boolean,
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  user_id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: false },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  authProvider: { type: String, required: true, enum: ['google', 'email'] },
  sessionToken: { type: String, required: false },
  sessionExpiry: { type: Date, required: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;