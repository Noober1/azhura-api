import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { extendedPrismaClient, ExtendedPrismaClient } from './prisma.extension';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  constructor() {}

  async onModuleInit() {
    await extendedPrismaClient.$connect();
  }

  async onModuleDestroy() {
    await extendedPrismaClient.$disconnect();
  }

  get db(): ExtendedPrismaClient {
    return extendedPrismaClient;
  }
}
