import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import axios, { AxiosInstance } from 'axios';
import { GuildInfo } from 'passport-discord';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  OAuth2Discord,
  OAuth2DiscordPayload,
  ValidateDiscordUser,
} from 'src/utils/types';

@Injectable()
export class DiscordService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private discordAPI: AxiosInstance;

  onModuleInit() {
    this.discordAPI = axios.create({
      baseURL: this.config.get('discord.apiUrl'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  async validateDiscordUser(
    data: ValidateDiscordUser,
  ): Promise<OAuth2DiscordPayload> {
    const { discord_id, guilds, email } = data;

    if (!this.isJoinedGuild(guilds)) {
      throw new UnauthorizedException('Not joined the guild');
    }

    const roles = await this.getUserRole(data.accessToken);

    const user = await this.prisma.db.user.findUnique({
      where: { discord_id },
    });

    const payload = { discord_id, email, roles };

    return user
      ? await this.updateUser(payload)
      : await this.createUser(payload);
  }

  private isJoinedGuild(guilds: GuildInfo[]) {
    const findGuild = guilds.findIndex(
      (item) => item.id === process.env.DISCORD_GUILD_ID,
    );

    return findGuild >= 0;
  }

  async getUserRole(accessToken: string): Promise<string[]> {
    const guildID = this.config.get('discord.guildId');
    try {
      const getData = await this.discordAPI.get(
        `/users/@me/guilds/${guildID}/member`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return getData.data.roles;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateUser(payload: OAuth2Discord) {
    const { roles, ...data } = payload;
    const update = await this.prisma.db.user.update({
      where: {
        discord_id: data.discord_id,
      },
      data,
    });

    return {
      ...update,
      roles,
    };
  }

  async createUser(payload: OAuth2Discord) {
    const { roles, ...data } = payload;
    const create = await this.prisma.db.user.create({
      data,
    });

    return {
      ...create,
      roles,
    };
  }

  async findUserByDiscordId(discord_id: User['discord_id']) {
    const user = await this.prisma.db.user.findUnique({
      where: {
        discord_id,
      },
    });
    return user;
  }
}
