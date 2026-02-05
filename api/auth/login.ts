// api/auth/login.ts - Compatibility route for /api/auth/login
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  
  const clientIP = getClientIP(req);
  
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required', code: 'MISSING_CREDENTIALS' });
    }
    
    if (!JWT_SECRET) {
      return res.status(500).json({ success: false, error: 'Server configuration error', code: 'JWT_SECRET_MISSING' });
    }
    
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Rate limiting - gracefully handle if table doesn't exist
    let rateLimitEnabled = true;
    try {
      const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
      const failedAttempts = await prisma.loginAttempt.count({
        where: { ip: clientIP, success: false, createdAt: { gte: windowStart } },
      });
      
      if (failedAttempts >= RATE_LIMIT_MAX_ATTEMPTS) {
        await prisma.$disconnect();
        const retryAfter = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);
        res.setHeader('Retry-After', retryAfter.toString());
        return res.status(429).json({ success: false, error: 'Too many login attempts', code: 'RATE_LIMITED', retryAfter });
      }
    } catch (e: any) {
      if (e.code === 'P2021') {
        rateLimitEnabled = false;
      } else {
        throw e;
      }
    }
    
    const admin = await prisma.admin.findUnique({ where: { username: String(username) } });
    
    if (!admin) {
      if (rateLimitEnabled) { try { await prisma.loginAttempt.create({ data: { ip: clientIP, success: false } }); } catch {} }
      await prisma.$disconnect();
      return res.status(401).json({ success: false, error: 'Invalid credentials', code: 'USER_NOT_FOUND' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      if (rateLimitEnabled) { try { await prisma.loginAttempt.create({ data: { ip: clientIP, success: false } }); } catch {} }
      await prisma.$disconnect();
      return res.status(401).json({ success: false, error: 'Invalid credentials', code: 'INVALID_PASSWORD' });
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
    return res.status(500).json({ success: false, error: error.message || 'Internal server error', code: error.code || 'UNKNOWN' });
  }
}
