import { Controller } from '@nestjs/common';
import { NihongoService } from './nihongo.service';
import { KotobaService } from './kotoba/kotoba.service';
import { useAuth } from 'src/auth/auth.decorator';

@useAuth()
@Controller('nihongo')
export class NihongoController {
  constructor(
    private readonly nihongo: NihongoService,
    private readonly kotoba: KotobaService,
  ) {}
}
