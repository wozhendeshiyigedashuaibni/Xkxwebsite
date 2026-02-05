// api/forgot-password.ts - 忘记密码（生成重置链接）
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const SITE_URL = process.env.SITE_URL || 'https://xikaixi.cn';
const RESET_TOKEN_EXPIRY_MINUTES = 15;

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
    const { username, email } = req.body;
    
    if (!username && !email) {
      return res.status(400).json({ success: false, error: '请输入用户名或邮箱', code: 'MISSING_FIELDS' });
    }
    
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // 查找用户（通过用户名或邮箱）
    let admin = null;
    if (username) {
      admin = await prisma.admin.findUnique({ where: { username: String(username) } });
    }
    if (!admin && email) {
      admin = await prisma.admin.findFirst({ where: { email: String(email) } });
    }
    
    // 即使用户不存在也返回成功（防止用户枚举）
    if (!admin) {
      await prisma.$disconnect();
      return res.status(200).json({ 
        success: true, 
        message: '如果账号存在，重置链接已发送' 
      });
    }
    
    // 生成重置 token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);
    
    // 保存到数据库
    await prisma.admin.update({
      where: { id: admin.id },
      data: { 
        resetToken,
        resetTokenExpiresAt,
      },
    });
    
    await prisma.$disconnect();
    
    // 生成重置链接
    const resetUrl = `${SITE_URL}/admin/reset-password?token=${resetToken}`;
    
    // TODO: 发送邮件（当前打印到日志）
    console.log('===========================================');
    console.log('密码重置请求');
    console.log(`用户: ${admin.username}`);
    console.log(`邮箱: ${(admin as any).email || '未设置'}`);
    console.log(`重置链接: ${resetUrl}`);
    console.log(`有效期至: ${resetTokenExpiresAt.toISOString()}`);
    console.log('===========================================');
    
    return res.status(200).json({ 
      success: true, 
      message: '如果账号存在，重置链接已发送',
      // 开发环境返回 token 方便测试
      ...(process.env.VERCEL_ENV !== 'production' && { 
        debug: { resetUrl, expiresAt: resetTokenExpiresAt } 
      }),
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, error: '服务器内部错误', code: 'UNKNOWN' });
  }
}
