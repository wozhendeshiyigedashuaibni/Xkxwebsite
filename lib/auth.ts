/**
 * 认证工具函数
 */

import type { VercelRequest } from '@vercel/node';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || '';

export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
  role: string;
  tokenVersion: number;
}

/**
 * 从请求头获取 token
 */
export function getTokenFromHeader(req: VercelRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * 验证 JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET not configured');
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * 验证请求是否已认证
 */
export async function authenticateRequest(req: VercelRequest): Promise<{
  authenticated: boolean;
  admin?: { id: number; username: string; email: string; role: string };
  error?: string;
}> {
  const token = getTokenFromHeader(req);

  if (!token) {
    return { authenticated: false, error: '未提供认证令牌' };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { authenticated: false, error: '认证令牌无效或已过期' };
  }

  // 验证管理员是否存在且 tokenVersion 匹配
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, email: true, role: true, tokenVersion: true },
    });

    if (!admin) {
      return { authenticated: false, error: '管理员账户不存在' };
    }

    // Check tokenVersion to ensure token hasn't been revoked
    if (admin.tokenVersion !== payload.tokenVersion) {
      return { authenticated: false, error: '登录已失效，请重新登录' };
    }

    return {
      authenticated: true,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { authenticated: false, error: '认证验证失败' };
  }
}
