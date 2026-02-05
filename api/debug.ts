// api/debug.ts
// 最简诊断端点 - 无任何外部依赖
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Debug endpoint working',
    env: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'configured' : 'MISSING',
    },
  });
}
