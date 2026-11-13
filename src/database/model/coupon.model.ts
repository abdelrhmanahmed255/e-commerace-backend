import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ICoupon } from '../../common/interface/coupon.interface';

export type CouponDocument = HydratedDocument<ICoupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ type: String, required: true, unique: true, uppercase: true })
  code: string;

  @Prop({ type: Number, required: true, min: 1, max: 100 })
  amount: number;

  @Prop({ type: Date, required: true })
  fromDate: Date;

  @Prop({ type: Date, required: true })
  toDate: Date;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  usedBy: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const couponSchema = SchemaFactory.createForClass(Coupon);

export const CouponModel = MongooseModule.forFeature([
  { name: Coupon.name, schema: couponSchema },
]);
