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
    if (!createMusicianDto.isHighlighted) {
      createMusicianDto.isHighlighted = false;
    }

    if (!image) throw new BadRequestException('image is required');
    try {
      const musician = this.musicianRepository.create({
        ...createMusicianDto,
      });
      await this.musicianRepository.save(musician);
      fs.renameSync(image.path, `./uploads/musician/${musician.id}.webp`);
      delete musician.isActive;
      return {
        ...musician,
        fullname: `${musician.name} ${musician.lastname}`,
        imageUrl: `${process.env.HOST_API}/file/musician/${musician.id}.webp`,
      };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll() {
    const result: Musician[] = await this.musicianRepository.find({
      where: { isActive: true },
    });
    const response = result.map((musician) => {
      return {
        ...musician,
        fullname: `${musician.name} ${musician.lastname}`,
        imageUrl: `${process.env.HOST_API}/file/musician/${musician.id}.webp`,
      };
    });
    return { totalCount: result.length, result: response };
  }

  async findAllPaginated(paginationDto: PaginationDto) {
    const { page = 1, pageSize = 10 } = paginationDto;
    const result: Musician[] = await this.musicianRepository.find({
      where: { isActive: true },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    const response = result.map((musician) => {
      return {
        ...musician,
        fullname: `${musician.name} ${musician.lastname}`,
        imageUrl: `${process.env.HOST_API}/file/musician/${musician.id}.webp`,
      };
    });
    const totalCount = await this.musicianRepository.count({
      where: { isActive: true },
    });
    return {
      page,
      pageSize,
      totalCount,
      pageCount: result.length,
      result: response,
    };
  }

  async findOne(id: string) {
    const result = await this.musicianRepository.findOneBy({
      id,
      isActive: true,
    });
    if (!result) throw new NotFoundException('Musician was not found');
    return {
      ...result,
      fullname: `${result.name} ${result.lastname}`,
      imageUrl: `${process.env.HOST_API}/file/musician/${id}.webp`,
    };
  }

  async update(
    id: string,
    updateMusicianDto: UpdateMusicianDto,
    image: Express.Multer.File,
  ) {
    const musician = await this.musicianRepository.preload({
      id,
      ...updateMusicianDto,
    });

    if (!musician) throw new NotFoundException('Musician was not found');

    if (image) fs.renameSync(image.path, `./uploads/musician/${id}.webp`);

    try {
      const result = await this.musicianRepository.save(musician);
      return {
        ...result,
        fullname: `${result.name} ${result.lastname}`,
        imageUrl: `${process.env.HOST_API}/file/musician/${id}.webp`,
      };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async remove(id: string) {
    const musician = await this.musicianRepository.preload({
      id,
      isActive: false,
    });

    if (!musician) throw new NotFoundException('Musician was not found');

    const result = await this.musicianRepository.save(musician);
    delete result.isActive;
    return {
      ...result,
      imageUrl: `${process.env.HOST_API}/file/musician/${id}.webp`,
    };
  }

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
