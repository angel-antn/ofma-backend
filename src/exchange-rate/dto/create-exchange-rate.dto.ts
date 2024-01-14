import { IsDecimal, IsNumber, IsPositive } from 'class-validator';

export class CreateExchangeRateDto {
  @IsNumber()
  @IsDecimal()
  @IsPositive()
  rate: number;
}
