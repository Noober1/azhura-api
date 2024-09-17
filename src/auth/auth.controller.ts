import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { useAuth } from './auth.decorator';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @ApiOperation({
    summary: 'Login with Discord',
    description: `[Click here to log in with Discord](http://localhost:3000/auth/discord)`,
  })
  @Get('discord')
  @useAuth('guard')
  async discordLogin() {}

  @ApiExcludeEndpoint()
  @Get('discord/callback')
  @useAuth('guard')
  async discordAuthCallback(@Res() res: Response) {
    res.redirect('/auth/status');
  }

  @Get('status')
  status(@Req() req: Request, @Res() res: Response) {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    } else {
      return res.status(401).json({ status: 'Not authenticated' });
    }
  }

  @Get('logout')
  logout(@Req() req: Request) {
    req.logout((err) => {
      if (err) {
        throw new InternalServerErrorException(err, {
          description: 'Failed to logout',
        });
      }
    });
    return { success: true, message: 'Logged out successfully' };
  }
}
