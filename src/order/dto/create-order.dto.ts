import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOrderDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

  @Type(() => Date)
  @IsDate()
  paidAt: Date;

  @IsString()
  reference: string;

  @IsString()
  @IsIn(['boleteria', 'suscripcion'])
  type: string;

  @IsString()
  @IsIn(['pendiente', 'rechazado', 'verificado'])
  status: string;

  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  exchangeRateId?: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  mobilePayBankAccountId?: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  transferBankAccountId?: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  zelleBankAccountId?: string;
}
