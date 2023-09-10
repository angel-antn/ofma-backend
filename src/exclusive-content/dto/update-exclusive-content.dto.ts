import { PartialType } from '@nestjs/mapped-types';
import { CreateExclusiveContentDto } from './create-exclusive-content.dto';

export class UpdateExclusiveContentDto extends PartialType(CreateExclusiveContentDto) {}
