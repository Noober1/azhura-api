import { Module } from '@nestjs/common';
import { GithubApiService } from './github-api.service';
import { DiscordApiModule } from 'src/discord-api/discord-api.module';
import { DiscordApiService } from 'src/discord-api/discord-api.service';
import { GithubApiController } from './github-api.controller';

@Module({
  imports: [DiscordApiModule],
  providers: [GithubApiService, DiscordApiService],
  exports: [GithubApiService],
  controllers: [GithubApiController],
})
export class GithubApiModule {}
