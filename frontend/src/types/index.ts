export interface Note {
  _id: string;
  content: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  user_id: string;
  name: string;
  email: string;
  image?: string;
  authProvider: string;
  sessionToken?: string;
  sessionExpiry?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
} 