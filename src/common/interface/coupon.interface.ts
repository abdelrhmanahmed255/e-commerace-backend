import { Types } from 'mongoose';

export interface ICoupon {
  _id?: Types.ObjectId;
  code: string;
  amount: number;
  fromDate: Date;
  toDate: Date;
  usedBy?: Types.ObjectId[];
  createdBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
