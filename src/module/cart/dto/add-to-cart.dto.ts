import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class AddToCartDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;
}
