import { Types } from 'mongoose';

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  image?: string;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  restoredAt?: Date;
}
