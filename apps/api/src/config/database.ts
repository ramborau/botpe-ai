import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Initialize Prisma Client
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Connection event handlers
prisma.$on('query' as never, (e: any) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  }
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('Prisma client disconnected');
});
