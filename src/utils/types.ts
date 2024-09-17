import { User } from '@prisma/client';
import { GuildInfo } from 'passport-discord';

export interface DiscordUser extends Required<User> {
  roles: string[];
}
export type DiscordPassportDone = (err: Error, user: DiscordUser) => void;
export interface ValidateDiscordUser extends Omit<User, 'id'> {
  accessToken: string;
  refreshToken: string;
  guilds: GuildInfo[];
}
export interface OAuth2Discord extends Omit<User, 'id'> {
  roles: string[];
}
export interface OAuth2DiscordPayload extends User {
  roles: string[];
}
