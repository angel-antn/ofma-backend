import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateZelleBankAccountDto {
  @IsString()
  accountAlias: string;

  @IsString()
  accountHolderName: string;

  @IsString()
  accountHolderEmail: string;

  @IsBoolean()
  @IsOptional()
  isShown: boolean;
}
