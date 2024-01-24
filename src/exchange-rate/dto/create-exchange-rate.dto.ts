import { IsNumber, IsPositive } from 'class-validator';

export class CreateExchangeRateDto {
  @IsNumber()
  @IsPositive()
  rate: number;
}
