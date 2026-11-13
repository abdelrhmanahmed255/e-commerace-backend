import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '../../../common/interface/order.interface';

@InputType()
export class CreateOrderDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  note?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  couponCode?: string;

  @Field(() => PaymentMethod, {
    nullable: true,
    defaultValue: PaymentMethod.CASH,
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;
}
