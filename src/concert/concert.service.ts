import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { Concert } from './entities/concert.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ConcertService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
  ) {}

  async create(createConcertDto: CreateConcertDto) {
    const { dates, startAtHours } = createConcertDto;
    if (dates.length !== startAtHours.length)
      throw new BadRequestException(
        'dates and startAtHours are Arrays and they must have the same length',
      );
    try {
      const { geo, ...concertInfo } = createConcertDto;
      let concert: Concert;
      if (geo) {
        const [lat, lon] = geo.split(',');
        concert = this.concertRepository.create({
          ...concertInfo,
          lat: Number(lat.trim()),
          lon: Number(lon.trim()),
        });
      } else {
        concert = this.concertRepository.create({ ...concertInfo });
      }
      await this.concertRepository.save(concert);
      return concert;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  async findAll(paginationDto: PaginationDto) {
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
    const result = await this.concertRepository.findOneBy({
      id,
      isActive: true,
    });
    if (!result) throw new NotFoundException('Concert was not found');
    return result;
  }

  async update(id: string, updateConcertDto: UpdateConcertDto) {
    const { dates, startAtHours } = updateConcertDto;

    if ((dates || startAtHours) && !(dates && startAtHours))
      throw new BadRequestException(
        'dates and startAtHours must be sent together or neither sent',
      );

    if (dates?.length !== startAtHours?.length)
      throw new BadRequestException(
        'dates and startAtHours are Arrays and they must have the same length',
      );

    const concert = await this.concertRepository.preload({
      id,
      ...updateConcertDto,
    });

    if (!concert) throw new NotFoundException('Concert was not found');

    return await this.concertRepository.save(concert);
  }

  async remove(id: string) {
    const concert = await this.concertRepository.preload({
      id,
      isActive: false,
    });

    if (!concert) throw new NotFoundException('Concert was not found');

    return await this.concertRepository.save(concert);
  }

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
