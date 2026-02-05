// api/reset-password.ts - 重置密码（使用 token）
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && ['https://xikaixi.cn', 'https://www.xikaixi.cn'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: '不支持的请求方法' });
  
  try {
    const { token, newPassword } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, error: '缺少重置令牌', code: 'MISSING_TOKEN' });
    }
    
    if (!newPassword) {
      return res.status(400).json({ success: false, error: '请输入新密码', code: 'MISSING_PASSWORD' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: '密码至少需要8个字符', code: 'WEAK_PASSWORD' });
    }
    
    if (newPassword === 'admin123') {
      return res.status(400).json({ success: false, error: '不能使用默认密码，请设置更安全的密码', code: 'DEFAULT_PASSWORD' });
    }
    
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // 查找拥有此 token 的用户
    const admin = await prisma.admin.findFirst({
      where: { resetToken: String(token) },
    });
    
    if (!admin) {
      await prisma.$disconnect();
      return res.status(400).json({ success: false, error: '无效的重置链接', code: 'INVALID_TOKEN' });
    }
    
    // 检查 token 是否过期
    const expiresAt = (admin as any).resetTokenExpiresAt;
    if (!expiresAt || new Date(expiresAt) < new Date()) {
      await prisma.$disconnect();
      return res.status(400).json({ success: false, error: '重置链接已过期，请重新申请', code: 'TOKEN_EXPIRED' });
    }
    
    // 更新密码并清除 token
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
        mustChangePassword: false,
      },
    });
    
    await prisma.$disconnect();
    
    return res.status(200).json({
      success: true,
      message: '密码已重置，请使用新密码登录',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, error: '服务器内部错误', code: 'UNKNOWN' });
  }
}
