import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  OrderStatus,
  PaymentMethod,
} from '../../../common/interface/order.interface';

registerEnumType(PaymentMethod, { name: 'PaymentMethod' });
registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class OrderProductType {
  @Field()
  name: string;

  @Field(() => ID)
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  unitPrice: number;

  @Field(() => Float)
  finalPrice: number;
}

@ObjectType()
export class OrderType {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  userId: string;

  @Field()
  address: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => [OrderProductType])
  products: OrderProductType[];

  @Field(() => ID, { nullable: true })
  couponId?: string;

  @Field(() => Float)
  subTotal: number;

  @Field(() => Float, { nullable: true })
  discountAmount?: number;

  @Field(() => Float)
  totalPrice: number;

  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field({ nullable: true })
  paymentIntentId?: string;

  @Field({ nullable: true })
  checkoutSessionId?: string;

  @Field({ nullable: true })
  paidAt?: Date;

  @Field({ nullable: true })
  canceledAt?: Date;

  @Field({ nullable: true })
  createdAt?: Date;
}

@ObjectType()
export class CheckoutSessionType {
  @Field()
  url: string;

  @Field()
  sessionId: string;
}
