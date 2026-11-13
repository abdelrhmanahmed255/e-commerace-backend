import { Prop, Schema, SchemaFactory, MongooseModule } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IProduct } from '../../common/interface/product.interface';

export type ProductDocument = HydratedDocument<IProduct>;

@Schema()
export class Product {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, default: 0 })
  discountPercent: number;

  @Prop({ type: Number, required: true })
  finalPrice: number;

  @Prop({ type: Number, default: 1 })
  stock: number;

  @Prop({ type: String, required: false })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Brand' })
  brandId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date })
  restoredAt: Date;
}

export const productSchema = SchemaFactory.createForClass(Product);

export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: productSchema },
]);
