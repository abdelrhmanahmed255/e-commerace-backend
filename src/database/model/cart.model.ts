import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ICart, ICartItem } from '../../common/interface/cart.interface';

export type CartDocument = HydratedDocument<ICart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true },
    },
  ])
  products: ICartItem[];

  @Prop({ type: Number, default: 0 })
  subTotal: number;
}

export const cartSchema = SchemaFactory.createForClass(Cart);

export const CartModel = MongooseModule.forFeature([
  { name: Cart.name, schema: cartSchema },
]);
