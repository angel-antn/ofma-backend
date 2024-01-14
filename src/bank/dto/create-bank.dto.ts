import { IsNumberString, IsString } from 'class-validator';

export class CreateBankDto {
  @IsString()
  name: string;

  @IsString()
  @IsNumberString()
  code: string;
}
