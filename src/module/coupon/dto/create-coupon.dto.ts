import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  amount: number;

  @IsDateString()
  fromDate: string;

  @IsDateString()
  toDate: string;
}
