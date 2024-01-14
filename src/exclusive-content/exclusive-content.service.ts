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
import { ExclusiveContentQueriesDto } from './dto/get-exclusive-content-queries.dto';

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

  async findAll(exclusiveContentQueriesDto: ExclusiveContentQueriesDto) {
    if (exclusiveContentQueriesDto.name == '')
      exclusiveContentQueriesDto.name = undefined;

    const query =
      this.exclusiveContentRepository.createQueryBuilder('exclusiveContent');

    query.where('exclusiveContent.isActive = :isActive', { isActive: true });

    if (exclusiveContentQueriesDto.name) {
      query.andWhere('LOWER(exclusiveContent.name) LIKE LOWER(:name)', {
        name: `%${exclusiveContentQueriesDto.name}%`,
      });
    }

    if (exclusiveContentQueriesDto.category) {
      query.andWhere('exclusiveContent.category = :category', {
        category: exclusiveContentQueriesDto.category,
      });
    }

    if (exclusiveContentQueriesDto.highlighted == 'true') {
      query.andWhere('exclusiveContent.isHighlighted = :isHighlighted', {
        isHighlighted: true,
      });
    }

    if (exclusiveContentQueriesDto.shown == 'true') {
      query.andWhere('exclusiveContent.isShown = :isShown', {
        isShown: true,
      });
    }

    if (exclusiveContentQueriesDto.published == 'true') {
      query.andWhere('exclusiveContent.isDraft = :isDraft', {
        isDraft: false,
      });
    }

    const result = await query.getMany();

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
    const result = await this.exclusiveContentRepository
      .createQueryBuilder('exclusiveContent')
      .leftJoinAndSelect(
        'exclusiveContent.exclusiveContentMusician',
        'exclusiveContentMusician',
      )
      .leftJoinAndSelect('exclusiveContentMusician.musician', 'musician')
      .addSelect('musician.isActive')
      .where('exclusiveContent.id = :id', { id })
      .andWhere('exclusiveContent.isActive = :isActive', { isActive: true })
      .getMany();

    if (!result[0]) throw new NotFoundException('Content was not found');

    result[0].exclusiveContentMusician =
      result[0].exclusiveContentMusician.filter((contentMusician) => {
        return contentMusician.musician.isActive;
      });

    result[0].exclusiveContentMusician = result[0].exclusiveContentMusician.map(
      (contentMusician) => {
        return {
          id: contentMusician.id,
          musicianId: contentMusician.musician.id,
          role: contentMusician.role,
          name: contentMusician.musician.name,
          lastname: contentMusician.musician.lastname,
          fullname: `${contentMusician.musician.name} ${contentMusician.musician.lastname}`,
          imageUrl: `${process.env.HOST_API}/file/musician/${contentMusician.musician.id}.webp`,
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
