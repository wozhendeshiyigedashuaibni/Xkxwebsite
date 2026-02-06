// api/reset-password.ts - 重置密码（验证 token hash + tokenVersion +1）
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';

// 对 token 做 SHA256 hash
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && ['https://xikaixi.cn', 'https://www.xikaixi.cn'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: '不支持的请求方法' });
  
  // 统一的无效 token 错误响应
  const INVALID_TOKEN_RESPONSE = { 
    success: false, 
    error: '重置链接无效或已过期', 
    code: 'INVALID_TOKEN' 
  };
  
  try {
    const { token, newPassword } = req.body;
    
    if (!token) {
      return res.status(400).json(INVALID_TOKEN_RESPONSE);
    }
    
    if (!newPassword) {
      return res.status(400).json({ success: false, error: '请输入新密码', code: 'MISSING_PASSWORD' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: '密码至少需要8个字符', code: 'WEAK_PASSWORD' });
    }
    
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // 对提交的 token 做 hash
    const tokenHash = hashToken(String(token));
    
    // 查找拥有此 token hash 的用户
    const admin = await prisma.admin.findFirst({
      where: { resetTokenHash: tokenHash },
      select: { id: true, resetTokenExpiresAt: true, tokenVersion: true }
    });
    
    // token 不存在
    if (!admin) {
      await prisma.$disconnect();
      return res.status(400).json(INVALID_TOKEN_RESPONSE);
    }
    
    // token 已过期
    if (!admin.resetTokenExpiresAt || new Date(admin.resetTokenExpiresAt) < new Date()) {
      // 清除过期的 token
      await prisma.admin.update({
        where: { id: admin.id },
        data: { resetTokenHash: null, resetTokenExpiresAt: null }
      });
      await prisma.$disconnect();
      return res.status(400).json(INVALID_TOKEN_RESPONSE);
    }
    
    // token 有效：更新密码
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        passwordHash: newPasswordHash,
        resetTokenHash: null,           // 清除 token（一次性使用）
        resetTokenExpiresAt: null,
        tokenVersion: admin.tokenVersion + 1,  // 使所有旧登录失效
      },
    });
    
    await prisma.$disconnect();
    
    return res.status(200).json({
      success: true,
      message: '密码已重置，请使用新密码登录',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, error: '服务器内部错误' });
  }
}
