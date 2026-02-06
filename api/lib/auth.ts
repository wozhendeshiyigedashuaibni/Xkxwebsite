/**
 * 认证工具函数
 */

import type { VercelRequest } from '@vercel/node';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'xikaixi-jwt-secret-change-in-production';

export interface JwtPayload {
  adminId: number;
  username: string;
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
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * 生成 JWT token
 */
export function generateToken(adminId: number, username: string): string {
  return jwt.sign(
    { adminId, username } as JwtPayload,
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * 验证请求是否已认证
 */
export async function authenticateRequest(req: VercelRequest): Promise<{
  authenticated: boolean;
  admin?: { id: number; username: string };
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

  // 验证管理员是否存在
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: payload.adminId },
      select: { id: true, username: true },
    });

    if (!admin) {
      return { authenticated: false, error: '管理员账户不存在' };
    }

    return { authenticated: true, admin };
  } catch {
    return { authenticated: false, error: '认证验证失败' };
  }
}
