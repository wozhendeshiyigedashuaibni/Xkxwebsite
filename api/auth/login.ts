// api/auth/login.ts - 登录兼容路由（中文提示）
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const VERCEL_ENV = process.env.VERCEL_ENV || 'development';
const IS_PRODUCTION = VERCEL_ENV === 'production';
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 10;
const DEFAULT_PASSWORD = 'admin123';

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  const realIP = req.headers['x-real-ip'];
  if (typeof realIP === 'string') return realIP;
  return req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && ['https://xikaixi.cn', 'https://www.xikaixi.cn'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: '不支持的请求方法' });
  
  const clientIP = getClientIP(req);
  
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, error: '请输入用户名和密码', code: 'MISSING_CREDENTIALS' });
    }
    
    if (!JWT_SECRET) {
      return res.status(500).json({ success: false, error: '服务器配置错误', code: 'JWT_SECRET_MISSING' });
    }
    
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // 限速检查
    let rateLimitEnabled = true;
    try {
      const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
      const failedAttempts = await prisma.loginAttempt.count({
        where: { ip: clientIP, success: false, createdAt: { gte: windowStart } },
      });
      
      if (failedAttempts >= RATE_LIMIT_MAX_ATTEMPTS) {
        await prisma.$disconnect();
        return res.status(429).json({ success: false, error: '尝试次数过多，请5分钟后再试', code: 'RATE_LIMITED' });
      }
    } catch (e: any) {
      if (e.code === 'P2021' || e.code === 'P2022') rateLimitEnabled = false;
      else throw e;
    }
    
    // 只选择必要字段（兼容旧数据库）
    const admin = await prisma.admin.findUnique({ 
      where: { username: String(username) },
      select: { id: true, username: true, password: true }
    });
    
    if (!admin) {
      if (rateLimitEnabled) { try { await prisma.loginAttempt.create({ data: { ip: clientIP, success: false } }); } catch {} }
      await prisma.$disconnect();
      return res.status(401).json({ success: false, error: '账号不存在', code: 'USER_NOT_FOUND' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      if (rateLimitEnabled) { try { await prisma.loginAttempt.create({ data: { ip: clientIP, success: false } }); } catch {} }
      await prisma.$disconnect();
      return res.status(401).json({ success: false, error: '密码错误', code: 'INVALID_PASSWORD' });
    }
    
    if (IS_PRODUCTION && password === DEFAULT_PASSWORD) {
      await prisma.$disconnect();
      return res.status(403).json({ 
        success: false, 
        error: '当前使用默认密码，出于安全考虑请先修改密码', 
        code: 'DEFAULT_PASSWORD_BLOCKED',
        mustChangePassword: true
      });
    }
    
    if (rateLimitEnabled) {
      try {
        await prisma.loginAttempt.create({ data: { ip: clientIP, success: true } });
        const cleanupDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: cleanupDate } } });
      } catch {}
    }
    
    await prisma.$disconnect();
    
    const token = jwt.sign(
      { userId: admin.id, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
    
    return res.status(200).json({
      success: true,
      data: { token, expiresIn: JWT_EXPIRES_IN, user: { id: admin.id, username: admin.username, role: 'admin' } },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: '服务器内部错误', code: error.code || 'UNKNOWN' });
  }
}
