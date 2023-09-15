import * as fs from 'node:fs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMusicianDto } from './dto/create-musician.dto';
import { UpdateMusicianDto } from './dto/update-musician.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Musician } from './entities/musician.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MusicianService {
  constructor(
    @InjectRepository(Musician)
    private readonly musicianRepository: Repository<Musician>,
  ) {}

  async create(
    createMusicianDto: CreateMusicianDto,
    image: Express.Multer.File,
  ) {
    if (!image) throw new BadRequestException('image is required');
    try {
      const musician = this.musicianRepository.create({
        ...createMusicianDto,
      });
      await this.musicianRepository.save(musician);
      fs.renameSync(
        image.path,
        `./uploads/musician/${musician.id}.${image.mimetype.split('/')[1]}`,
      );
      return musician;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, pageSize = 10 } = paginationDto;
    const result = await this.musicianRepository.find({
      where: { isActive: true },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    const totalCount = await this.musicianRepository.count({
      where: { isActive: true },
    });
    return { page, pageSize, totalCount, pageCount: result.length, result };
  }

  async findOne(id: string) {
    const result = await this.musicianRepository.findOneBy({
      id,
      isActive: true,
    });
    if (!result) throw new NotFoundException('Musician was not found');
    return result;
  }

  async update(id: string, updateMusicianDto: UpdateMusicianDto) {
    const musician = await this.musicianRepository.preload({
      id,
      ...updateMusicianDto,
    });

    if (!musician) throw new NotFoundException('Musician was not found');

    return await this.musicianRepository.save(musician);
  }

  async remove(id: string) {
    const musician = await this.musicianRepository.preload({
      id,
      isActive: false,
    });

    if (!musician) throw new NotFoundException('Musician was not found');

    return await this.musicianRepository.save(musician);
  }

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
