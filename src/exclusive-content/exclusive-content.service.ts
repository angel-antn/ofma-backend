import * as fs from 'node:fs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateExclusiveContentDto } from './dto/create-exclusive-content.dto';
import { UpdateExclusiveContentDto } from './dto/update-exclusive-content.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ExclusiveContent } from './entities/exclusive-content.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeShownStatusDto } from './dto/change-shown-status.dto';
import { EditMusicianInContentDto } from './dto/edit-musician-in-content.dto';
import { AddMusicianInContentDto } from './dto/add-musician-in-content.dto';
import { ExclusiveContentMusician } from './entities/exclusive-content-musician.entity';
import { MusicianService } from 'src/musician/musician.service';

@Injectable()
export class ExclusiveContentService {
  constructor(
    @InjectRepository(ExclusiveContent)
    private readonly exclusiveContentRepository: Repository<ExclusiveContent>,
    @InjectRepository(ExclusiveContentMusician)
    private readonly exclusiveContentMusicianRepository: Repository<ExclusiveContentMusician>,
    private readonly musicianService: MusicianService,
  ) {}

  async create(
    createExclusiveContentDto: CreateExclusiveContentDto,
    image: Express.Multer.File,
  ) {
    if (!image) throw new BadRequestException('image is required');

    try {
      const exclusiveContent = this.exclusiveContentRepository.create({
        ...createExclusiveContentDto,
      });
      await this.exclusiveContentRepository.save(exclusiveContent);
      fs.renameSync(
        image.path,
        `./uploads/exclusive-content/images/${exclusiveContent.id}.webp`,
      );
      delete exclusiveContent.isActive;
      return {
        ...exclusiveContent,
        imageUrl: `${process.env.HOST_API}/file/exclusive-content/images/${exclusiveContent.id}.webp`,
      };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async uploadVideo(id: string, video: Express.Multer.File) {
    const result = await this.exclusiveContentRepository.findOneBy({
      id,
      isActive: true,
      isDraft: true,
    });
    if (!result)
      throw new NotFoundException("Exclusive content's draft was not found");
    if (!video) throw new BadRequestException('video is required');

    fs.renameSync(video.path, `./uploads/exclusive-content/videos/${id}.mp4`);

    const exclusiveContent = await this.exclusiveContentRepository.preload({
      id,
      isDraft: false,
    });

    try {
      const result =
        await this.exclusiveContentRepository.save(exclusiveContent);
      return {
        ...result,
        imageUrl: `${process.env.HOST_API}/file/exclusive-content/images/${id}.webp`,
        videoUrl: `${process.env.HOST_API}/file/exclusive-content/videos/${id}.mp4`,
      };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async changeShownStatus(changeShownStatusDto: ChangeShownStatusDto) {
    const { id, isShown } = changeShownStatusDto;

    const exclusiveContent = await this.exclusiveContentRepository.preload({
      id,
      isShown,
    });

    if (!exclusiveContent)
      throw new NotFoundException('Exclusive content was not found');

    try {
      await this.exclusiveContentRepository.save(exclusiveContent);
      return exclusiveContent;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll() {
    const result = await this.exclusiveContentRepository.find({
      where: { isActive: true },
    });
    const response = result.map((exclusiveContent) => {
      let res = {
        ...exclusiveContent,
        imageUrl: `${process.env.HOST_API}/file/exclusive-content/images/${exclusiveContent.id}.webp`,
      };
      if (!exclusiveContent.isDraft) {
        res = {
          ...res,
          videoUrl: `${process.env.HOST_API}/file/exclusive-content/videos/${exclusiveContent.id}.mp4`,
        } as any;
      }
      return res;
    });
    return { totalCount: result.length, result: response };
  }

  async findAllPaginated(paginationDto: PaginationDto) {
    const { page = 1, pageSize = 10 } = paginationDto;
    const result = await this.exclusiveContentRepository.find({
      where: { isActive: true },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    const totalCount = await this.exclusiveContentRepository.count({
      where: { isActive: true },
    });
    return { page, pageSize, totalCount, pageCount: result.length, result };
  }

  async findOne(id: string) {
    const result = await this.exclusiveContentRepository.find({
      where: { id, isActive: true },
      relations: {
        exclusiveContentMusician: { musician: true },
      },
    });

    if (!result[0]) throw new NotFoundException('Content was not found');

    result[0].exclusiveContentMusician = result[0].exclusiveContentMusician.map(
      (concertMusician) => {
        return {
          id: concertMusician.id,
          musicianId: concertMusician.musician.id,
          role: concertMusician.role,
          name: concertMusician.musician.name,
          lastname: concertMusician.musician.lastname,
          fullname: `${concertMusician.musician.name} ${concertMusician.musician.lastname}`,
          imageUrl: `${process.env.HOST_API}/file/musician/${concertMusician.musician.id}.webp`,
        } as any;
      },
    );

    return {
      ...result[0],
      imageUrl: `${process.env.HOST_API}/file/exclusive-content/images/${result[0].id}.webp`,
      videoUrl: `${process.env.HOST_API}/file/exclusive-content/videos/${result[0].id}.mp4`,
    };
  }

  async update(
    id: string,
    updateExclusiveContentDto: UpdateExclusiveContentDto,
    image: Express.Multer.File,
  ) {
    const exclusiveContent = await this.exclusiveContentRepository.preload({
      id,
      ...updateExclusiveContentDto,
    });

    if (!exclusiveContent)
      throw new NotFoundException('Exclusive content was not found');

    if (image)
      fs.renameSync(
        image.path,
        `./uploads/exclusive-content/images/${id}.webp`,
      );

    try {
      const result =
        await this.exclusiveContentRepository.save(exclusiveContent);
      return {
        ...result,
        imageUrl: `${process.env.HOST_API}/file/exclusive-content/images/${id}.webp`,
      };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async remove(id: string) {
    const exclusiveContent = await this.exclusiveContentRepository.preload({
      id,
      isActive: false,
    });

    if (!exclusiveContent)
      throw new NotFoundException('Exclusive content was not found');

    return await this.exclusiveContentRepository.save(exclusiveContent);
  }

  async addMusicianToContent(addMusicianInContentDto: AddMusicianInContentDto) {
    const { exclusiveContentId, musicianId, role } = addMusicianInContentDto;
    const exclusiveContent = await this.findOne(exclusiveContentId);
    const musician = await this.musicianService.findOne(musicianId);
    const contentMusician: ExclusiveContentMusician =
      this.exclusiveContentMusicianRepository.create({
        exclusiveContent,
        musician,
        role,
      });
    await this.exclusiveContentMusicianRepository.save(contentMusician);
    return contentMusician;
  }

  async deleteMusicianToContent(id: string) {
    const contentMusician =
      await this.exclusiveContentMusicianRepository.findOne({
        where: { id },
      });

    if (!contentMusician) {
      throw new NotFoundException('Musician in content was not found');
    }

    await this.exclusiveContentMusicianRepository.remove(contentMusician);
    return contentMusician;
  }

  async updateMusicianToContent(
    id: string,
    editMusicianInContentDto: EditMusicianInContentDto,
  ) {
    const { role } = editMusicianInContentDto;
    const contentMusician =
      await this.exclusiveContentMusicianRepository.preload({
        id,
        role,
      });

    if (!contentMusician) throw new NotFoundException('content was not found');

    return await this.exclusiveContentMusicianRepository.save(contentMusician);
  }

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
