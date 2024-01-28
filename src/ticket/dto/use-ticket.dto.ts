import { IsString, IsUUID } from 'class-validator';

export class UseTicketDto {
  @IsUUID()
  @IsString()
  id: string;
}
