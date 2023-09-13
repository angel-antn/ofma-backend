import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('Concerts')
export class Concert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('date', { array: true })
  dates: Date[];

  @Column('time', { array: true })
  startAtHours: string[];

  @Column('time', { array: true })
  endAtHours: string[];

  @Column('date')
  startDate: Date;

  @Column('bool', { default: true, select: false })
  isActive: boolean;

  @Column('double precision', { nullable: true })
  lon: number;

  @Column('double precision', { nullable: true })
  lat: number;

  @Column('text')
  description: string;

  @Column('int')
  entriesQty: number;

  @BeforeInsert()
  @BeforeUpdate()
  fillFields() {
    let auxDate: Date;
    let auxHour: string;
    for (let i = 0; i < this.dates.length; i++) {
      for (let j = 0; j < this.dates.length - 1; j++) {
        if (this.dates[j].getTime() > this.dates[j + 1].getTime()) {
          auxDate = this.dates[j];
          this.dates[j] = this.dates[j + 1];
          this.dates[j + 1] = auxDate;

          auxHour = this.startAtHours[j];
          this.startAtHours[j] = this.startAtHours[j + 1];
          this.startAtHours[j + 1] = auxHour;

          auxHour = this.endAtHours[j];
          this.endAtHours[j] = this.endAtHours[j + 1];
          this.endAtHours[j + 1] = auxHour;
        }
      }
    }

    this.startDate = this.dates[0];
  }
}
