import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateKotobaDto } from './dto/create-kotoba.dto';
import { UpdateKotobaDto } from './dto/update-kotoba.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlePrismaException } from 'src/prisma/exceptions';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { validate } from 'class-validator';
import { Kotoba } from '@prisma/client';

@Injectable()
export class KotobaService {
  constructor(private prisma: PrismaService) {}

  async create(createKotobaDto: CreateKotobaDto) {
    try {
      return await this.prisma.db.kotoba.create({
        data: createKotobaDto,
      });
    } catch (error) {
      throw handlePrismaException(error);
    }
  }

  getAllKotoba(page: number = 1, limit: number = 10) {
    return this.prisma.db.kotoba
      .paginate({
        orderBy: {
          hiragana: 'asc',
        },
      })
      .withPages({
        page,
        limit,
      });
  }

  async findOne(kotoba: string) {
    try {
      return await this.prisma.db.kotoba.findFirstOrThrow({
        where: {
          word: kotoba,
        },
      });
    } catch (error) {
      throw handlePrismaException(error);
    }
  }

  async update(kotoba: string, updateKotobaDto: UpdateKotobaDto) {
    try {
      return await this.prisma.db.kotoba.update({
        where: {
          word: kotoba,
        },
        data: updateKotobaDto,
      });
    } catch (error) {
      throw handlePrismaException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} kotoba`;
  }

  async getKotobaFromCSV(file: Express.Multer.File) {
    const errors = [];
    try {
      const data = await this.parseCSV(file);
      for (const item of data) {
        const checkErrors = await validate(item);

        if (checkErrors.length > 0) {
          errors.push({
            item,
            errors: checkErrors.toString(),
          });
        }

        // If item structure is not valid
        if (Object.keys(item).length > 4) {
          throw new BadRequestException(item);
        }
      }

      if (errors.length > 0) {
        console.error(errors);
        throw new BadRequestException({
          success: false,
          message: 'Error validation',
        });
      }

      return await this.prisma.db.kotoba.createMany({
        data,
        skipDuplicates: true,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getRandomKotoba() {
    const productsCount = await this.prisma.db.kotoba.count();
    const skip = Math.floor(Math.random() * productsCount);
    const getData = await this.prisma.db.kotoba.findMany({
      take: 1,
      skip: skip,
    });

    if (getData.length < 1) {
      throw new NotFoundException('No data available');
    }

    return getData[0];
  }

  private parseCSV(file: Express.Multer.File): Promise<CreateKotobaDto[]> {
    const results = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data: Kotoba) => {
          const item = Object.assign(new CreateKotobaDto(), data);
          results.push(item);
        })
        .on('end', () => {
          resolve(results); // When done, return the results (CSV rows)
        })
        .on('error', (error) => {
          reject(error);
        })
        .on('finish', () => {
          fs.unlinkSync(file.path);
        });
    });
  }
}
