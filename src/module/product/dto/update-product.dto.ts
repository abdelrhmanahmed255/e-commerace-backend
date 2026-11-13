import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class UpdateProductDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(1)
  @IsOptional()
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercent?: number;

  @Field(() => Int, { nullable: true })
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
