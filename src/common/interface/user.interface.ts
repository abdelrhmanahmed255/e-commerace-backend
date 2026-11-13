import { Types } from 'mongoose';

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  phone?: string;
  isConfirmed?: boolean;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  restoredAt?: Date;
}
