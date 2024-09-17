import { Module } from '@nestjs/common';
import { KotobaService } from './kotoba.service';
import { KotobaController } from './kotoba.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [KotobaController],
  providers: [KotobaService, PrismaService],
})
export class KotobaModule {}
