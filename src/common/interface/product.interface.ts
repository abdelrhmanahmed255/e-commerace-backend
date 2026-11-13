import { Types } from 'mongoose';

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPercent?: number;
  finalPrice: number;
  stock: number;
  image?: string;
  categoryId?: Types.ObjectId;
  brandId?: Types.ObjectId;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  restoredAt?: Date;
}
