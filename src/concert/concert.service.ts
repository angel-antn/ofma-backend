import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Concert } from './entities/concert.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ConcertService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertRepository: Repository<Concert>,
  ) {}

  async create(createConcertDto: CreateConcertDto) {
    const { dates, endAtHours, startAtHours } = createConcertDto;
    if (
      dates.length !== startAtHours.length ||
      dates.length !== endAtHours.length
    )
      throw new BadRequestException(
        'dates, endAtHours and startAtHours are Arrays and they must have the same length',
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
    const result = await this.concertRepository.findOneBy({ id });
    if (!result) throw new NotFoundException('Concert was not found');
    return result;
  }

  async update(id: string, updateConcertDto: UpdateConcertDto) {
    const { dates, startAtHours, endAtHours } = updateConcertDto;

    if (
      (dates || startAtHours || endAtHours) &&
      !(dates && startAtHours && endAtHours)
    )
      throw new BadRequestException(
        'dates, endAtHours and startAtHours must be sent together or neither sent',
      );

    if (
      dates?.length !== startAtHours?.length ||
      dates?.length !== endAtHours?.length
    )
      throw new BadRequestException(
        'dates, endAtHours and startAtHours are Arrays and they must have the same length',
      );

    const concert = await this.concertRepository.preload({
      id,
      ...updateConcertDto,
    });

    if (!concert) throw new NotFoundException('Concert was not found');

    return await this.concertRepository.save(concert);
  }

  async remove(id: string) {
    return `This action removes a #${id} concert`;
  }

  private handleExceptions(err): never {
    if (err.code == '23505') {
      throw new BadRequestException(err.detail);
    }
    console.log(err);
    throw new InternalServerErrorException('server failed, check the logs!');
  }
}
