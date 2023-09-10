import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExclusiveContentService } from './exclusive-content.service';
import { CreateExclusiveContentDto } from './dto/create-exclusive-content.dto';
import { UpdateExclusiveContentDto } from './dto/update-exclusive-content.dto';

@Controller('exclusive-content')
export class ExclusiveContentController {
  constructor(private readonly exclusiveContentService: ExclusiveContentService) {}

  @Post()
  create(@Body() createExclusiveContentDto: CreateExclusiveContentDto) {
    return this.exclusiveContentService.create(createExclusiveContentDto);
  }

  @Get()
  findAll() {
    return this.exclusiveContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exclusiveContentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExclusiveContentDto: UpdateExclusiveContentDto) {
    return this.exclusiveContentService.update(+id, updateExclusiveContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exclusiveContentService.remove(+id);
  }
}
