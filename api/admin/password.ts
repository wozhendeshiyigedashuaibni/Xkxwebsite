// api/admin/password.ts - 修改密码（tokenVersion +1 使旧 token 失效）
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && ['https://xikaixi.cn', 'https://www.xikaixi.cn'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: '不支持的请求方法' });
  
  if (!JWT_SECRET) {
    return res.status(500).json({ success: false, error: '服务器配置错误' });
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: '请先登录', code: 'NO_TOKEN' });
  }
  
  let decoded: any;
  try {
    decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
  } catch {
    return res.status(401).json({ success: false, error: '登录已过期，请重新登录', code: 'INVALID_TOKEN' });
  }
  
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: '请输入当前密码和新密码', code: 'MISSING_FIELDS' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: '新密码至少需要8个字符', code: 'WEAK_PASSWORD' });
    }
    
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const admin = await prisma.admin.findUnique({ 
      where: { id: decoded.userId },
      select: { id: true, passwordHash: true, tokenVersion: true }
    });
    
    if (!admin) {
      await prisma.$disconnect();
      return res.status(404).json({ success: false, error: '用户不存在', code: 'NOT_FOUND' });
    }
    
    // 验证 tokenVersion（确保 token 未被吊销）
    if (admin.tokenVersion !== decoded.tokenVersion) {
      await prisma.$disconnect();
      return res.status(401).json({ success: false, error: '登录已失效，请重新登录', code: 'TOKEN_REVOKED' });
    }
    
    const isValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isValid) {
      await prisma.$disconnect();
      return res.status(401).json({ success: false, error: '当前密码错误', code: 'WRONG_PASSWORD' });
    }
    
    // 更新密码并递增 tokenVersion（使所有旧 token 失效）
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: decoded.userId },
      data: { 
        passwordHash: newPasswordHash,
        tokenVersion: admin.tokenVersion + 1,
      },
    });
    
    await prisma.$disconnect();
    
    return res.status(200).json({
      success: true,
      message: '密码修改成功，请重新登录',
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    return res.status(500).json({ success: false, error: '服务器内部错误' });
  }
}
