import { Controller, Get, Res } from '@nestjs/common';
import { DiscordApiService } from 'src/discord-api/discord-api.service';
import { GithubApiService } from './github-api.service';
import { Response } from 'express';

@Controller('github-api')
export class GithubApiController {
  constructor(
    private discordApi: DiscordApiService,
    private githubApi: GithubApiService,
  ) {}

  @Get('test')
  async testPage(@Res() res: Response) {
    const data = await this.githubApi.generateGithubBanner();
    res.setHeader('Content-Type', 'image/png');
    res.send(data);
  }
}
