import { Module } from '@nestjs/common';
import { NihongoController } from './nihongo.controller';
import { NihongoService } from './nihongo.service';
import { KotobaService } from './kotoba/kotoba.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { KotobaModule } from './kotoba/kotoba.module';

@Module({
  controllers: [NihongoController],
  providers: [NihongoService, KotobaService, PrismaService],
  imports: [KotobaModule],
})
export class NihongoModule {}
