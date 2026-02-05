// api/forgot-password.ts - 忘记密码（安全设计：统一响应 + token hash）
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as crypto from 'crypto';

const SITE_URL = process.env.SITE_URL || 'https://xikaixi.cn';
const RESET_TOKEN_EXPIRY_MINUTES = 15;

// 限速配置：同一 IP 5分钟内最多 5 次请求
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  const realIP = req.headers['x-real-ip'];
  if (typeof realIP === 'string') return realIP;
  return req.socket?.remoteAddress || 'unknown';
}

// 生成随机 token
function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

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
  
  // 统一响应消息（无论邮箱是否存在）
  const UNIFIED_RESPONSE = { 
    success: true, 
    message: '如果该邮箱已注册，我们已发送重置密码链接，请查收邮件' 
  };
  
  const clientIP = getClientIP(req);
  
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: '请输入邮箱地址', code: 'MISSING_EMAIL' });
    }
    
    const normalizedEmail = String(email).toLowerCase().trim();
    
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // 限速检查
    let rateLimitEnabled = true;
    try {
      const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
      
      // 同一 IP 限速
      const ipAttempts = await prisma.passwordResetAttempt.count({
        where: { ip: clientIP, createdAt: { gte: windowStart } },
      });
      
      if (ipAttempts >= RATE_LIMIT_MAX_ATTEMPTS) {
        await prisma.$disconnect();
        return res.status(429).json({ 
          success: false, 
          error: '请求过于频繁，请稍后再试', 
          code: 'RATE_LIMITED' 
        });
      }
      
      // 同一邮箱限速
      const emailAttempts = await prisma.passwordResetAttempt.count({
        where: { email: normalizedEmail, createdAt: { gte: windowStart } },
      });
      
      if (emailAttempts >= 3) {
        // 不返回特殊错误，仍返回统一响应（防止枚举）
        await prisma.$disconnect();
        return res.status(200).json(UNIFIED_RESPONSE);
      }
    } catch (e: any) {
      if (e.code === 'P2021' || e.code === 'P2022') rateLimitEnabled = false;
      else throw e;
    }
    
    // 记录请求（无论邮箱是否存在）
    if (rateLimitEnabled) {
      try {
        await prisma.passwordResetAttempt.create({
          data: { ip: clientIP, email: normalizedEmail }
        });
      } catch {}
    }
    
    // 查找用户
    const admin = await prisma.admin.findUnique({ 
      where: { email: normalizedEmail },
      select: { id: true, email: true }
    });
    
    // 邮箱不存在：返回统一响应，不做任何操作
    if (!admin) {
      await prisma.$disconnect();
      return res.status(200).json(UNIFIED_RESPONSE);
    }
    
    // 邮箱存在：生成重置 token
    const resetToken = generateResetToken();
    const resetTokenHash = hashToken(resetToken);
    const resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);
    
    // 只存储 token hash，不存储明文
    await prisma.admin.update({
      where: { id: admin.id },
      data: { 
        resetTokenHash,
        resetTokenExpiresAt,
      },
    });
    
    await prisma.$disconnect();
    
    // 生成重置链接
    const resetUrl = `${SITE_URL}/admin/reset-password?token=${resetToken}`;
    
    // 输出到日志（后续接入邮件服务时替换）
    console.log('===========================================');
    console.log('密码重置请求');
    console.log(`邮箱: ${admin.email}`);
    console.log(`重置链接: ${resetUrl}`);
    console.log(`有效期至: ${resetTokenExpiresAt.toISOString()} (${RESET_TOKEN_EXPIRY_MINUTES}分钟)`);
    console.log('===========================================');
    
    // 返回统一响应
    return res.status(200).json(UNIFIED_RESPONSE);
    
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, error: '服务器内部错误' });
  }
}
