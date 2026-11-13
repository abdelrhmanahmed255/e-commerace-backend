import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ConfirmOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(4, 6)
  otp: string;
}
