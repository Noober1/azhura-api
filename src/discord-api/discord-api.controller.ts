import { Controller, Get, Param, Query } from '@nestjs/common';
import { DiscordApiService } from './discord-api.service';

@Controller('discord-api')
export class DiscordApiController {
  constructor(private discord: DiscordApiService) {}

  @Get()
  discordApi() {
    return 'Discord API';
  }

  @Get('user/azhura')
  getMyUserdata() {
    return this.discord.getMyUserdata();
  }

  @Get('user/:userId')
  getUserdata(@Param('userId') params: string) {
    return this.discord.getUserdata(params);
  }

  @Get('activity/:userId')
  getUserActivity(@Param('userId') userId: string) {
    return this.discord.getUserActivity(userId);
  }

  @Get('applications')
  getAppInfo(@Query('id') queries: string[]) {
    return this.discord.getAppsInfo(
      typeof queries == 'string' ? [queries] : queries,
    );
  }
}
