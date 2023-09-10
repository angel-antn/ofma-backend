import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MusicianService } from './musician.service';
import { CreateMusicianDto } from './dto/create-musician.dto';
import { UpdateMusicianDto } from './dto/update-musician.dto';

@Controller('musician')
export class MusicianController {
  constructor(private readonly musicianService: MusicianService) {}

  @Post()
  create(@Body() createMusicianDto: CreateMusicianDto) {
    return this.musicianService.create(createMusicianDto);
  }

  @Get()
  findAll() {
    return this.musicianService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.musicianService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMusicianDto: UpdateMusicianDto) {
    return this.musicianService.update(+id, updateMusicianDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.musicianService.remove(+id);
  }
}
