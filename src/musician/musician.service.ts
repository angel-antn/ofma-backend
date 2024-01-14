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
import { MusicianQueriesDto } from './dto/get-musician-queries.dto';

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

  async findAll(musicianQueriesDto: MusicianQueriesDto) {
    if (musicianQueriesDto.name == '') musicianQueriesDto.name = undefined;

    const query = this.musicianRepository.createQueryBuilder('musicians');

    query.where('musicians.isActive = :isActive', { isActive: true });

    if (musicianQueriesDto.name) {
      query.andWhere(
        "CONCAT(LOWER(musicians.name), ' ', LOWER(musicians.lastname)) LIKE LOWER(:name)",
        {
          name: `%${musicianQueriesDto.name}%`,
        },
      );
    }

    if (musicianQueriesDto.highlighted == 'true') {
      query.andWhere('musicians.isHighlighted = :isHighlighted', {
        isHighlighted: true,
      });
    }

    const result = await query.getMany();

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
    const result = await this.musicianRepository.findOne({
      where: { id, isActive: true },
    });

    if (!result) throw new NotFoundException('Musician was not found');

    const concertCount = await this.musicianRepository
      .createQueryBuilder('musician')
      .leftJoin('musician.concertMusician', 'concertMusician')
      .select('COUNT(DISTINCT concertMusician.concertId)')
      .where('musician.id = :id', { id })
      .getRawOne();

    const exclusiveContentCount = await this.musicianRepository
      .createQueryBuilder('musician')
      .leftJoin('musician.exclusiveContentMusician', 'exclusiveContentMusician')
      .select('COUNT(DISTINCT exclusiveContentMusician.exclusiveContentId)')
      .where('musician.id = :id', { id })
      .getRawOne();

    return {
      ...result,
      fullname: `${result.name} ${result.lastname}`,
      imageUrl: `${process.env.HOST_API}/file/musician/${id}.webp`,
      concertCount: concertCount.count,
      exclusiveContentCount: exclusiveContentCount.count,
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
