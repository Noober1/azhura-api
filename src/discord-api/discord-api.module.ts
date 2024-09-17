import { Module } from '@nestjs/common';
import { DiscordApiService } from './discord-api.service';
import { DiscordApiController } from './discord-api.controller';

@Module({
  providers: [DiscordApiService],
  exports: [DiscordApiService],
  controllers: [DiscordApiController],
})
export class DiscordApiModule {}
