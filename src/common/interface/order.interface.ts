import { Types } from 'mongoose';

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
}

export enum OrderStatus {
  PENDING = 'pending',
  PLACED = 'placed',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
}

export interface IOrderProduct {
  name: string;
  productId: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  finalPrice: number;
}

export interface IOrder {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  address: string;
  phone: string;
  note?: string;
  products: IOrderProduct[];
  couponId?: Types.ObjectId;
  subTotal: number;
  discountAmount?: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  paymentIntentId?: string;
  checkoutSessionId?: string;
  paidAt?: Date;
  canceledAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
