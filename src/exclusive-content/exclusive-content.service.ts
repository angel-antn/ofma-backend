import { Injectable } from '@nestjs/common';
import { CreateExclusiveContentDto } from './dto/create-exclusive-content.dto';
import { UpdateExclusiveContentDto } from './dto/update-exclusive-content.dto';

@Injectable()
export class ExclusiveContentService {
  create(createExclusiveContentDto: CreateExclusiveContentDto) {
    return 'This action adds a new exclusiveContent';
  }

  findAll() {
    return `This action returns all exclusiveContent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exclusiveContent`;
  }

  update(id: number, updateExclusiveContentDto: UpdateExclusiveContentDto) {
    return `This action updates a #${id} exclusiveContent`;
  }

  remove(id: number) {
    return `This action removes a #${id} exclusiveContent`;
  }
}
