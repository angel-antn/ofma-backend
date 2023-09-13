import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { AdminUserModule } from './admin-user/admin-user.module';
import { MusicianModule } from './musician/musician.module';
import { ConcertModule } from './concert/concert.module';
import { ExclusiveContentModule } from './exclusive-content/exclusive-content.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AdminUserModule,
    MusicianModule,
    ConcertModule,
    ExclusiveContentModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
