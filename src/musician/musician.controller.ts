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
import { ValidRoles } from 'src/common/enums/valid-roles.enum';
import { Auth } from 'src/common/decorators/auth.decorator';
import { MusicianQueriesDto } from './dto/get-musician-queries.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Musician')
@Controller('musician')
export class MusicianController {
  constructor(private readonly musicianService: MusicianService) {}

  @Post()
  @Auth(ValidRoles.admin_user)
  @UseInterceptors(imageInterceptor('musician'))
  create(
    @Body() createMusicianDto: CreateMusicianDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.musicianService.create(createMusicianDto, image);
  }

  @Get()
  findAll(@Query() musicianQueriesDto: MusicianQueriesDto) {
    return this.musicianService.findAll(musicianQueriesDto);
  }

  @Get('paginated')
  findAllPaginated(@Query() paginationDto: PaginationDto) {
    return this.musicianService.findAllPaginated(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.musicianService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin_user)
  @UseInterceptors(imageInterceptor('musician'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMusicianDto: UpdateMusicianDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.musicianService.update(id, updateMusicianDto, image);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin_user)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.musicianService.remove(id);
  }
}
