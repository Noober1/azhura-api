import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-discord';
import { DiscordService } from './discord.service';
import { DiscordPassportDone } from 'src/utils/types';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    @Inject('DISCORD_AUTH_SERVICE')
    private readonly discordAuthService: DiscordService,
  ) {
    super({
      clientID: process.env.DISCORD_CLIENT_ID, // Discord client ID
      clientSecret: process.env.DISCORD_CLIENT_SECRET, // Discord client secret
      callbackURL: process.env.DISCORD_AUTH_CALLBACK_URI, // OAuth2 callback URL
      scope: ['identify', 'email', 'guilds', 'guilds.members.read'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: DiscordPassportDone,
  ): Promise<any> {
    const { id: discord_id, email, guilds } = profile;
    console.log(profile);

    // Call the AuthService to validate and save user information
    const user = await this.discordAuthService.validateDiscordUser({
      accessToken,
      refreshToken,
      discord_id,
      email,
      guilds,
    });
    // return user;
    done(null, user);
  }
}
