// api/ping.ts
// 简单诊断端点 - 测试数据库连接
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from './lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const diagnostics: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'MISSING',
      DIRECT_URL: process.env.DIRECT_URL ? 'configured' : 'MISSING',
    },
    database: 'not tested',
    productCount: null,
    error: null,
  };

  try {
    // 测试数据库连接
    await prisma.$queryRaw`SELECT 1`;
    diagnostics.database = 'connected';

    // 测试Product表
    const count = await prisma.product.count();
    diagnostics.productCount = count;
  } catch (error: any) {
    diagnostics.status = 'error';
    diagnostics.database = 'failed';
    diagnostics.error = {
      name: error.name,
      message: error.message,
      code: error.code,
    };
  }

  res.status(diagnostics.status === 'ok' ? 200 : 500).json(diagnostics);
}
