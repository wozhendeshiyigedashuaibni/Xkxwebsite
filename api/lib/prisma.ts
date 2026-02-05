// api/lib/prisma.ts
// Dynamic Prisma client for Vercel Serverless
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | undefined;

export async function getPrisma(): Promise<PrismaClient> {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  
  if (!prismaInstance) {
    const { PrismaClient: PC } = await import('@prisma/client');
    prismaInstance = new PC({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
  
  return prismaInstance;
}

// Legacy export for backward compatibility (may not work in all cases)
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
