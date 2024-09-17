import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { DiscordService } from './discord/discord.service';
import { DiscordStrategy } from './discord/discord.strategy';
import { SessionSerializer } from './auth.serializer';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PassportModule.register({ session: true })], // Enable sessions
  providers: [
    DiscordStrategy,
    SessionSerializer,
    {
      provide: 'DISCORD_AUTH_SERVICE',
      useClass: DiscordService,
    },
    PrismaService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
