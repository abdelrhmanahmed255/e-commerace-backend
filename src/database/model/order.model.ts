import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  IOrder,
  IOrderProduct,
  OrderStatus,
  PaymentMethod,
} from '../../common/interface/order.interface';

export type OrderDocument = HydratedDocument<IOrder>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String })
  note: string;

  @Prop([
    {
      name: { type: String, required: true },
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      finalPrice: { type: Number, required: true },
    },
  ])
  products: IOrderProduct[];

  @Prop({ type: Types.ObjectId, ref: 'Coupon' })
  couponId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  subTotal: number;

  @Prop({ type: Number, default: 0 })
  discountAmount: number;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({
    type: String,
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({ type: String })
  paymentIntentId: string;

  @Prop({ type: String })
  checkoutSessionId: string;

  @Prop({ type: Date })
  paidAt: Date;

  @Prop({ type: Date })
  canceledAt: Date;
}

export const orderSchema = SchemaFactory.createForClass(Order);

export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: orderSchema },
]);
