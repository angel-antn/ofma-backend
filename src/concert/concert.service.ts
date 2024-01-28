import * as fs from 'node:fs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Concert } from './entities/concert.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { ConcertMusician } from './entities/concert-musician.entity';
import { MusicianService } from 'src/musician/musician.service';
import { AddMusicianInConcertDto } from './dto/add-musician-in-concert.dto';
import { EditMusicianInConcertDto } from './dto/edit-musician-in-concert.dto';
import { ConcertsQueriesDto } from './dto/get-concerts-queries.dto';
import { TicketService } from 'src/ticket/ticket.service';

@Injectable()
export class ConcertService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
    @InjectRepository(ConcertMusician)
    private readonly concertMusicianRepository: Repository<ConcertMusician>,
    private readonly musicianService: MusicianService,
    private readonly ticketService: TicketService,
  ) {}

  async create(createConcertDto: CreateConcertDto, image: Express.Multer.File) {
    if (!image) throw new BadRequestException('image is required');

    try {
      const concertInfo = createConcertDto;
      const concert: Concert = this.concertRepository.create({
        ...concertInfo,
      });
      await this.concertRepository.save(concert);
      fs.renameSync(image.path, `./uploads/concert/${concert.id}.webp`);
      return {
        ...concert,
        imageUrl: `${process.env.HOST_API}/file/concert/${concert.id}.webp`,
      };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll(concertsQueriesDto: ConcertsQueriesDto) {
    const result = await this.concertRepository.find({
      where: {
        isActive: true,
        hasFinish: concertsQueriesDto.all == 'true' ? undefined : false,
      },
      order: { startDate: 'DESC' },
    });

    const response = result.map((concert) => {
      return {
        ...concert,
        imageUrl: `${process.env.HOST_API}/file/concert/${concert.id}.webp`,
      };
    });
    return { totalCount: result.length, result: response };
  }

  async findAllPaginated(paginationDto: PaginationDto) {
    const { page = 1, pageSize = 10 } = paginationDto;
    const result = await this.concertRepository.find({
      where: { isActive: true },
      order: { startDate: 'DESC' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    const totalCount = await this.concertRepository.count({
      where: { isActive: true },
    });
    return { page, pageSize, totalCount, pageCount: result.length, result };
  }

  async findOne(id: string) {
    const result = await this.concertRepository
      .createQueryBuilder('concert')
      .leftJoinAndSelect('concert.concertMusician', 'concertMusician')
      .leftJoinAndSelect('concertMusician.musician', 'musician')
      .addSelect('musician.isActive')
      .where('concert.id = :id', { id })
      .andWhere('concert.isActive = :isActive', { isActive: true })
      .getMany();

    if (!result[0]) throw new NotFoundException('Concert was not found');

    result[0].concertMusician = result[0].concertMusician.filter(
      (concertMusician) => {
        return concertMusician.musician.isActive;
      },
    );

    const ticketSoldQty = await this.ticketService.countAllPerConcert(
      result[0],
    );

    result[0].concertMusician = result[0].concertMusician.map(
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
      imageUrl: `${process.env.HOST_API}/file/concert/${result[0].id}.webp`,
      ticketSoldQty,
    };
  }

  async update(
    id: string,
    updateConcertDto: UpdateConcertDto,
    image: Express.Multer.File,
  ) {
    const concert = await this.concertRepository.preload({
      id,
      ...updateConcertDto,
    });

    if (!concert) throw new NotFoundException('Concert was not found');

    if (image) fs.renameSync(image.path, `./uploads/concert/${id}.webp`);

    try {
      const result = await this.concertRepository.save(concert);
      return {
        ...result,
        imageUrl: `${process.env.HOST_API}/file/concert/${id}.webp`,
      };
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async remove(id: string) {
    const concert = await this.concertRepository.preload({
      id,
      isActive: false,
    });

    if (!concert) throw new NotFoundException('Concert was not found');

    return await this.concertRepository.save(concert);
  }

  async addMusicianToConcert(addMusicianInConcertDto: AddMusicianInConcertDto) {
    const { concertId, musicianId, role } = addMusicianInConcertDto;
    const concert = await this.findOne(concertId);
    const musician = await this.musicianService.findOne(musicianId);
    const concertMusician: ConcertMusician =
      this.concertMusicianRepository.create({
        concert,
        musician,
        role,
      });
    await this.concertMusicianRepository.save(concertMusician);
    return concertMusician;
  }

  async deleteMusicianToConcert(id: string) {
    const concertMusician = await this.concertMusicianRepository.findOne({
      where: { id },
    });

    if (!concertMusician) {
      throw new NotFoundException('Musician in concert was not found');
    }

    await this.concertMusicianRepository.remove(concertMusician);
    return concertMusician;
  }

  async updateMusicianToConcert(
    id: string,
    editMusicianInConcertDto: EditMusicianInConcertDto,
  ) {
    const { role } = editMusicianInConcertDto;
    const concertMusician = await this.concertMusicianRepository.preload({
      id,
      role,
    });

    if (!concertMusician) throw new NotFoundException('Concert was not found');

    return await this.concertMusicianRepository.save(concertMusician);
  }

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
