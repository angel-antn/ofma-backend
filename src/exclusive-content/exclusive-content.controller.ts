import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ExclusiveContentService } from './exclusive-content.service';
import { CreateExclusiveContentDto } from './dto/create-exclusive-content.dto';
import { UpdateExclusiveContentDto } from './dto/update-exclusive-content.dto';
import { ValidRoles } from 'src/common/enums/valid-roles.enum';
import { imageInterceptor } from 'src/file/interceptors/image.interceptor';
import { videoInterceptor } from 'src/file/interceptors/video.interceptor';
import { ChangeShownStatusDto } from './dto/change-shown-status.dto';
import { AddMusicianInContentDto } from './dto/add-musician-in-content.dto';
import { EditMusicianInContentDto } from './dto/edit-musician-in-content.dto';
import { ExclusiveContentQueriesDto } from './dto/get-exclusive-content-queries.dto';

@Controller('exclusive-content')
export class ExclusiveContentController {
  constructor(
    private readonly exclusiveContentService: ExclusiveContentService,
  ) {}

  @Post()
  @Auth(ValidRoles.admin_user)
  @UseInterceptors(imageInterceptor('exclusive-content/images'))
  create(
    @Body() createExclusiveContentDto: CreateExclusiveContentDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.exclusiveContentService.create(
      createExclusiveContentDto,
      image,
    );
  }

  @Post('upload-video/:id')
  @Auth(ValidRoles.admin_user)
  @UseInterceptors(videoInterceptor('exclusive-content/videos'))
  uploadVideo(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return this.exclusiveContentService.uploadVideo(id, video);
  }

  @Post('change-shown-status')
  @Auth(ValidRoles.admin_user)
  changeShownStatus(@Body() changeShownStatusDto: ChangeShownStatusDto) {
    return this.exclusiveContentService.changeShownStatus(changeShownStatusDto);
  }

  @Get()
  findAll(@Query() exclusiveContentQueriesDto: ExclusiveContentQueriesDto) {
    return this.exclusiveContentService.findAll(exclusiveContentQueriesDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.exclusiveContentService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin_user)
  @UseInterceptors(imageInterceptor('exclusive-content/images'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExclusiveContentDto: UpdateExclusiveContentDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.exclusiveContentService.update(
      id,
      updateExclusiveContentDto,
      image,
    );
  }

  @Post('content-musician')
  @Auth(ValidRoles.admin_user)
  insertMusician(@Body() addMusicianInContentDto: AddMusicianInContentDto) {
    return this.exclusiveContentService.addMusicianToContent(
      addMusicianInContentDto,
    );
  }

  @Delete('content-musician/:id')
  @Auth(ValidRoles.admin_user)
  deleteMusician(@Param('id', ParseUUIDPipe) id: string) {
    return this.exclusiveContentService.deleteMusicianToContent(id);
  }

  @Patch('content-musician/:id')
  @Auth(ValidRoles.admin_user)
  updateMusician(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() editMusicianInContentDto: EditMusicianInContentDto,
  ) {
    return this.exclusiveContentService.updateMusicianToContent(
      id,
      editMusicianInContentDto,
    );
  }

  @Delete(':id')
  @Auth(ValidRoles.admin_user)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.exclusiveContentService.remove(id);
  }
}
