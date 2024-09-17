import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { KotobaService } from './kotoba.service';
import { CreateKotobaDto } from './dto/create-kotoba.dto';
import { UpdateKotobaDto } from './dto/update-kotoba.dto';
import { PaginationDto } from 'src/prisma/dto/pagination.dto';
import { ApiPagination } from 'src/prisma/prisma.decorator';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiFindOne } from 'src/utils/utils.decorator';
import { useAuth } from 'src/auth/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';

@ApiTags('Nihongo')
@useAuth()
@Controller('nihongo/kotoba')
@useAuth()
export class KotobaController {
  constructor(private readonly kotoba: KotobaService) {}

  @Post()
  @ApiOkResponse({ description: 'Data added' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  create(@Body() createKotobaDto: CreateKotobaDto) {
    return this.kotoba.create(createKotobaDto);
  }

  @Get()
  @ApiPagination()
  async findAll(@Res() res: Response, @Query() { page, size }: PaginationDto) {
    const data = await this.kotoba.getAllKotoba(page, size);
    return res.json(data);
  }

  @Get('/random')
  getRandomKotoba() {
    return this.kotoba.getRandomKotoba();
  }

  @Get(':kotoba')
  @ApiFindOne()
  async findOne(@Res() res: Response, @Param('kotoba') kotoba: string) {
    const data = await this.kotoba.findOne(kotoba);
    return res.json(data);
  }

  @Patch(':kotoba')
  update(
    @Param('kotoba') kotoba: string,
    @Body() updateKotobaDto: UpdateKotobaDto,
  ) {
    return this.kotoba.update(kotoba, updateKotobaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kotoba.remove(+id);
  }

  @ApiOperation({ summary: 'Upload a CSV file and process it' }) // Add a summary for this endpoint
  @ApiConsumes('multipart/form-data') // Specify that the endpoint consumes multipart form data
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  }) // Describe the body as an object containing a file
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
      }),
      fileFilter: (req, file, cb) => {
        // Only accept files with CSV MIME type or .csv extension
        if (
          file.mimetype === 'text/csv' ||
          file.originalname.match(/\.(csv)$/)
        ) {
          cb(null, true); // Accept file
        } else {
          cb(new BadRequestException('Only CSV files are allowed!'), false); // Reject file
        }
      },
    }),
  ) // 'file' is the name of the field in the form data
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    // Ensure the file exists and is CSV
    if (!file) {
      throw new BadRequestException('File not uploaded');
    }

    return this.kotoba.getKotobaFromCSV(file);

    // const results = [];

    // return new Promise((resolve, reject) => {
    //   fs.createReadStream(file.path)
    //     .pipe(csv())
    //     .on('data', (data) => results.push(data))
    //     .on('end', () => {
    //       resolve(results); // When done, return the results (CSV rows)
    //     })
    //     .on('error', (error) => {
    //       reject(error);
    //     });
    // });
  }
}
