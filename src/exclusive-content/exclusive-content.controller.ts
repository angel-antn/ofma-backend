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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { ExclusiveContentService } from './exclusive-content.service';
import { CreateExclusiveContentDto } from './dto/create-exclusive-content.dto';
import { UpdateExclusiveContentDto } from './dto/update-exclusive-content.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ValidRoles } from 'src/common/enums/valid-roles.enum';
import { imageInterceptor } from 'src/file/interceptors/image.interceptor';

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

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.exclusiveContentService.findAll(paginationDto);
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

  @Delete(':id')
  @Auth(ValidRoles.admin_user)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.exclusiveContentService.remove(id);
  }
}
