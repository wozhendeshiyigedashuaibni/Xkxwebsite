import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const checks: Record<string, any> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      DIRECT_URL: process.env.DIRECT_URL ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'not set',
    },
  };

  // Try to import and connect Prisma
  try {
    const { PrismaClient } = await import('@prisma/client');
    checks.prismaImport = 'success';

    const prisma = new PrismaClient();
    checks.prismaInit = 'success';

    await prisma.$connect();
    checks.database = 'connected';

    const adminCount = await prisma.admin.count();
    checks.adminCount = adminCount;

    const productCount = await prisma.product.count();
    checks.productCount = productCount;

    await prisma.$disconnect();
  } catch (err: any) {
    checks.error = err.message;
    checks.errorStack = err.stack?.split('\n').slice(0, 5);
  }

  res.status(200).json(checks);
}
