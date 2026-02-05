// api/admin/password.ts - 修改密码接口（中文提示）
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
    return res.status(500).json({ success: false, error: '服务器配置错误', code: 'JWT_SECRET_MISSING' });
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: '请先登录', code: 'NO_TOKEN' });
  }
  
  let userId: number;
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
    userId = decoded.userId;
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
    
    if (newPassword === 'admin123') {
      return res.status(400).json({ success: false, error: '不能使用默认密码，请设置更安全的密码', code: 'DEFAULT_PASSWORD' });
    }
    
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // 只选择必要字段
    const admin = await prisma.admin.findUnique({ 
      where: { id: userId },
      select: { id: true, password: true }
    });
    
    if (!admin) {
      await prisma.$disconnect();
      return res.status(404).json({ success: false, error: '用户不存在', code: 'NOT_FOUND' });
    }
    
    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) {
      await prisma.$disconnect();
      return res.status(401).json({ success: false, error: '当前密码错误', code: 'WRONG_PASSWORD' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    
    await prisma.$disconnect();
    
    return res.status(200).json({
      success: true,
      message: '密码修改成功，请重新登录',
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    return res.status(500).json({ success: false, error: '服务器内部错误', code: 'UNKNOWN' });
  }
}
