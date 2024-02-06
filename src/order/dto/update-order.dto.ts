import { IsIn, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsIn(['pendiente', 'rechazado', 'verificado', 'reembolsado'])
  status: string;
}
