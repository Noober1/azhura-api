import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { DiscordService } from './discord/discord.service';
import { DiscordPassportDone, DiscordUser } from 'src/utils/types';

export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('DISCORD_AUTH_SERVICE')
    private readonly discordAuthService: DiscordService,
  ) {
    super();
  }
  serializeUser(user: DiscordUser, done: DiscordPassportDone) {
    done(null, user);
  }
  async deserializeUser(user: DiscordUser, done: DiscordPassportDone) {
    const session = await this.discordAuthService.findUserByDiscordId(
      user.discord_id,
    );
    return session
      ? done(null, {
          ...session,
          roles: user.roles,
        })
      : done(null, null);
  }
}
