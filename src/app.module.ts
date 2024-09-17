import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DiscordApiModule } from './discord-api/discord-api.module';
import config from './config/config';
import { DiscordApiService } from './discord-api/discord-api.service';
import { GithubApiModule } from './github-api/github-api.module';
import { GithubApiService } from './github-api/github-api.service';
import { NihongoModule } from './nihongo/nihongo.module';
import { PrismaService } from './prisma/prisma.service';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3h' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    WinstonModule.forRoot({
      transports: [new winston.transports.Console()],
    }),
    DiscordApiModule,
    GithubApiModule,
    NihongoModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [AppService, DiscordApiService, GithubApiService, PrismaService],
})
export class AppModule {}
