/**
 * 健康检查接口
 * GET /api/health
 *
 * 用于验证 API 是否正常运行
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    // 测试数据库连接
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    console.error('健康检查失败:', error);
    return res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
