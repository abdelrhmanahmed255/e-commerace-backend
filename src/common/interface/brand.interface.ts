import { Types } from 'mongoose';

export interface IBrand {
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
