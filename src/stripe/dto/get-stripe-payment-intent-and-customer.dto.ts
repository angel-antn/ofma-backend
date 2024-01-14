import { IsEmail, IsNumberString, IsString, MinLength } from 'class-validator';

export class GetStripePaymentIntentAndCustomerDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  lastname: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNumberString()
  amount: string;
}
