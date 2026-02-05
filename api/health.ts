// api/health.ts
// 健康检查 API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from './lib/prisma';
import { withCors } from './lib/cors';
import { successResponse, errorResponse } from './lib/response';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return errorResponse(res, 'Method not allowed', 405);
  }
  
  try {
    const prisma = await getPrisma();
    // 测试数据库连接
    await prisma.$queryRaw`SELECT 1`;
    
    return successResponse(res, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    return errorResponse(res, 'Health check failed', 503, error);
  }
}

export default withCors(handler);
