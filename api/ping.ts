// api/ping.ts
// 诊断端点 - 测试Prisma导入和数据库连接
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const diagnostics: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'MISSING',
      DIRECT_URL: process.env.DIRECT_URL ? 'configured' : 'MISSING',
    },
    prismaImport: 'not tested',
    database: 'not tested',
    productCount: null,
    error: null,
  };

  try {
    // 动态导入Prisma以捕获导入错误
    const { PrismaClient } = await import('@prisma/client');
    diagnostics.prismaImport = 'success';

    const prisma = new PrismaClient();
    
    // 测试数据库连接
    await prisma.$queryRaw`SELECT 1`;
    diagnostics.database = 'connected';

    // 测试Product表
    const count = await prisma.product.count();
    diagnostics.productCount = count;

    await prisma.$disconnect();
  } catch (error: any) {
    diagnostics.status = 'error';
    diagnostics.error = {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 5),
    };
  }

  res.status(diagnostics.status === 'ok' ? 200 : 500).json(diagnostics);
}
