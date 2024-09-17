import { PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';

// pagination for all models
export const extendedPrismaClient = new PrismaClient({
  log:
    process.env.NODE_ENV === 'production'
      ? ['warn', 'error']
      : ['query', 'info', 'warn', 'error'],
}).$extends(pagination());

export type ExtendedPrismaClient = typeof extendedPrismaClient;
