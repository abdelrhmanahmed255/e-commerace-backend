import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class CreateProductDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(1)
  price: number;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercent?: number;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  image?: string;

  @Field({ nullable: true })
  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @Field({ nullable: true })
  @IsMongoId()
  @IsOptional()
  brandId?: string;
}
