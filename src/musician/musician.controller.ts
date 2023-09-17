import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MusicianService } from './musician.service';
import { CreateMusicianDto } from './dto/create-musician.dto';
import { UpdateMusicianDto } from './dto/update-musician.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { imageInterceptor } from 'src/file/interceptors/image.interceptor';

@Controller('musician')
export class MusicianController {
  constructor(private readonly musicianService: MusicianService) {}

  @Post()
  @UseInterceptors(imageInterceptor('musician'))
  create(
    @Body() createMusicianDto: CreateMusicianDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.musicianService.create(createMusicianDto, image);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.musicianService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.musicianService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(imageInterceptor('musician'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMusicianDto: UpdateMusicianDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.musicianService.update(id, updateMusicianDto, image);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.musicianService.remove(id);
  }
}
