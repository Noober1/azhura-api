import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function handlePrismaException(error: any) {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint failed
        return new BadRequestException('Mutation error: Duplicate data');
      case 'P2025': // Record not found
        return new NotFoundException('Data not found');
      case 'P2023': // Invalid value
        return new BadRequestException('Invalid value');
      default:
        return new InternalServerErrorException('An unexpected error occurred');
    }
  }
  // For other types of errors
  return new InternalServerErrorException('An unexpected error occurred');
}
