/**
 * Prisma Client Singleton for Vercel Serverless
 * 避免在 serverless 环境中创建多个连接
 */

import { PrismaClient } from '@prisma/client';

declare global {
  var __prismaClient: PrismaClient | undefined;
}

const prismaClient = global.__prismaClient || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.__prismaClient = prismaClient;
}

// Export both named and default for compatibility
export const prisma = prismaClient;
export default prismaClient;
