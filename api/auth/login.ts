// api/auth/login.ts - 登录兼容路由
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 10;

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: '不支持的请求方法' });
  
  const clientIP = getClientIP(req);
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: '请输入邮箱和密码', code: 'MISSING_CREDENTIALS' });
    }
    
    if (!JWT_SECRET) {
      return res.status(500).json({ success: false, error: '服务器配置错误', code: 'CONFIG_ERROR' });
    }
    
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
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
    
    const admin = await prisma.admin.findUnique({ 
      where: { email: String(email).toLowerCase() },
      select: { id: true, email: true, passwordHash: true, role: true, tokenVersion: true }
    });
    
    if (!admin) {
      if (rateLimitEnabled) { try { await prisma.loginAttempt.create({ data: { ip: clientIP, success: false } }); } catch {} }
      await prisma.$disconnect();
      return res.status(401).json({ success: false, error: '邮箱或密码错误', code: 'INVALID_CREDENTIALS' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isPasswordValid) {
      if (rateLimitEnabled) { try { await prisma.loginAttempt.create({ data: { ip: clientIP, success: false } }); } catch {} }
      await prisma.$disconnect();
      return res.status(401).json({ success: false, error: '邮箱或密码错误', code: 'INVALID_CREDENTIALS' });
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
      { userId: admin.id, email: admin.email, role: admin.role, tokenVersion: admin.tokenVersion },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
    
    return res.status(200).json({
      success: true,
      data: { token, expiresIn: JWT_EXPIRES_IN, user: { id: admin.id, email: admin.email, role: admin.role } },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: '服务器内部错误', code: error.code || 'UNKNOWN' });
  }
}
