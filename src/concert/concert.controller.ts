import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { imageInterceptor } from 'src/file/interceptors/image.interceptor';
import { ValidRoles } from 'src/common/enums/valid-roles.enum';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AddMusicianInConcertDto } from './dto/add-musician-in-concert.dto';
import { EditMusicianInConcertDto } from './dto/edit-musician-in-concert.dto';
import { ConcertsQueriesDto } from './dto/get-concerts-queries.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Concert')
@Controller('concert')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Post()
  @Auth(ValidRoles.admin_user)
  @UseInterceptors(imageInterceptor('concert'))
  create(
    @Body() createConcertDto: CreateConcertDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.concertService.create(createConcertDto, image);
  }

  @Get()
  findAll(@Query() concertsQueriesDto: ConcertsQueriesDto) {
    return this.concertService.findAll(concertsQueriesDto);
  }

  @Get('paginated')
  findAllPaginated(@Query() paginationDto: PaginationDto) {
    return this.concertService.findAllPaginated(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.concertService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin_user)
  @UseInterceptors(imageInterceptor('concert'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConcertDto: UpdateConcertDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.concertService.update(id, updateConcertDto, image);
  }

  @Post('concert-musician')
  @Auth(ValidRoles.admin_user)
  insertMusician(@Body() addMusicianInConcertDto: AddMusicianInConcertDto) {
    return this.concertService.addMusicianToConcert(addMusicianInConcertDto);
  }

  @Delete('concert-musician/:id')
  @Auth(ValidRoles.admin_user)
  deleteMusician(@Param('id', ParseUUIDPipe) id: string) {
    return this.concertService.deleteMusicianToConcert(id);
  }

  @Patch('concert-musician/:id')
  @Auth(ValidRoles.admin_user)
  updateMusician(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() editMusicianInConcertDto: EditMusicianInConcertDto,
  ) {
    return this.concertService.updateMusicianToConcert(
      id,
      editMusicianInConcertDto,
    );
  }

  @Delete(':id')
  @Auth(ValidRoles.admin_user)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.concertService.remove(id);
  }
}
