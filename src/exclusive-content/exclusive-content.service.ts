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

@Injectable()
export class ExclusiveContentService {
  constructor(
    @InjectRepository(ExclusiveContent)
    private readonly exclusiveContentRepository: Repository<ExclusiveContent>,
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
      return {
        ...exclusiveContent,
        imageUrl: `${process.env.HOST_API}/file/exclusive-content/images/${exclusiveContent.id}.webp`,
      };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll(paginationDto: PaginationDto) {
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
    const result = await this.exclusiveContentRepository.findOneBy({
      id,
      isActive: true,
    });
    if (!result) throw new NotFoundException('Exclucive content was not found');
    return result;
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

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
