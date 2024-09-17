import { applyDecorators, UseGuards } from '@nestjs/common';
import { DiscordAuthGuard, AuthenticatedGuard } from './discord/discord.guard';

export function useAuth(type: 'guard' | 'authenticated' = 'authenticated') {
  return applyDecorators(
    type === 'authenticated'
      ? UseGuards(AuthenticatedGuard)
      : UseGuards(DiscordAuthGuard),
  );
}
