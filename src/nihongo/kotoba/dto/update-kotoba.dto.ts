import { PartialType } from '@nestjs/swagger';
import { CreateKotobaDto } from './create-kotoba.dto';

export class UpdateKotobaDto extends PartialType(CreateKotobaDto) {}
