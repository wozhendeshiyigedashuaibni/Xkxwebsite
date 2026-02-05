// api/auth/me.ts
// 验证当前用户 Token 并返回用户信息
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma';
import { verifyToken, extractToken } from '../lib/auth';
import { withCors } from '../lib/cors';
import { successResponse, errorResponse, handleError } from '../lib/response';

async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return errorResponse(res, 'Method not allowed', 405);
  }
  
  try {
    // 提取 Token
    const token = extractToken(req.headers.authorization as string);
    
    if (!token) {
      return errorResponse(res, 'No token provided', 401);
    }
    
    // 验证 Token
    const payload = verifyToken(token);
    
    // 从数据库获取最新用户信息
    const admin = await prisma.admin.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!admin) {
      return errorResponse(res, 'User not found', 404);
    }
    
    // 返回用户信息
    return successResponse(res, {
      id: admin.id,
      username: admin.username,
      role: payload.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    });
    
  } catch (error) {
    return handleError(res, error);
  }
}

export default withCors(handler);
