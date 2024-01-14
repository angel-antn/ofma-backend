import { IsString } from 'class-validator';

export class CreateZelleBankAccountDto {
  @IsString()
  accountAlias: string;

  @IsString()
  accountHolderName: string;

  @IsString()
  accountHolderEmail: string;
}
