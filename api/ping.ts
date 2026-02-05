// api/ping.ts
// 简单诊断端点 - 无数据库依赖
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'MISSING',
      DIRECT_URL: process.env.DIRECT_URL ? 'configured' : 'MISSING',
    },
  });
}
