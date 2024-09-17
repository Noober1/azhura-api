import { ApiProperty } from '@nestjs/swagger';
import { KOTOBA_TYPE } from '@prisma/client';
import { IsOptional, IsEnum, IsString, IsNotEmpty } from 'class-validator';

export class CreateKotobaDto {
  @ApiProperty({
    enum: KOTOBA_TYPE,
  })
  @IsEnum(KOTOBA_TYPE, { each: true })
  @IsNotEmpty()
  type: KOTOBA_TYPE;

  @ApiProperty()
  @IsString()
  word: string;

  @ApiProperty()
  @IsString()
  hiragana: string;

  @ApiProperty()
  @IsString()
  meaning: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  explanation: string;
}
