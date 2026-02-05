// api/me.ts
// 验证当前用户 Token 并返回用户信息
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  const origin = req.headers.origin;
  if (origin && ['https://xikaixi.cn', 'https://www.xikaixi.cn'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    // 提取 Token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }
    
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    
    if (!JWT_SECRET) {
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }
    
    // 验证 Token
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    // Dynamic Prisma import
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const admin = await prisma.admin.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    await prisma.$disconnect();
    
    if (!admin) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        role: payload.role,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Auth error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
