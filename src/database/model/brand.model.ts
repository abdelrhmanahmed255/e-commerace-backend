import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IBrand } from '../../common/interface/brand.interface';
import { MongooseModule } from '@nestjs/mongoose';

export type BrandDocument = HydratedDocument<IBrand>;

@Schema()
export class Brand {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;

  @Prop({ type: String, required: false })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  restoredAt: Date;
}

export const brandSchema = SchemaFactory.createForClass(Brand);

export const BrandModel = MongooseModule.forFeature([
  { name: Brand.name, schema: brandSchema },
]);
