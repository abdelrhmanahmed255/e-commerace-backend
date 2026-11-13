import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductType {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float, { nullable: true })
  discountPercent?: number;

  @Field(() => Float)
  finalPrice: number;

  @Field(() => Int)
  stock: number;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  brandId?: string;

  @Field({ nullable: true })
  createdBy?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
