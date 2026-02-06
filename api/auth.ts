/**
 * 认证统一接口
 *
 * POST /api/auth - 登录（用户名+密码）
 * POST /api/auth?action=forgot - 忘记密码（发送重置邮件）
 * POST /api/auth?action=reset - 重置密码（验证token并设置新密码）
 * GET /api/auth - 获取当前登录用户信息
 * PUT /api/auth - 修改密码（需登录）
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { authenticateRequest } from '../lib/auth';
import { json, unauthorized, serverError } from '../lib/response';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const RESET_TOKEN_EXPIRES_MINUTES = 15;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 10;
const RESET_RATE_LIMIT_MAX = 5; // 忘记密码请求限制
const SITE_URL = process.env.SITE_URL || 'https://xikaixi.cn';

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  const realIP = req.headers['x-real-ip'];
  if (typeof realIP === 'string') return realIP;
  return req.socket?.remoteAddress || 'unknown';
}

function resolveLoginAccount(body: any): { account: string; password: string } | null {
  const rawAccount = body?.account ?? body?.username ?? body?.email;
  const password = body?.password;
  if (!rawAccount || !password) return null;
  return {
    account: String(rawAccount).trim(),
    password: String(password),
  };
}

function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: '密码长度至少8位' };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: '密码必须包含字母' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '密码必须包含数字' };
  }
  const weakPasswords = ['password', 'admin123', '12345678', 'password123', 'admin888', 'xikaixi68168'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return { valid: false, message: '密码过于简单，请使用更复杂的密码' };
  }
  return { valid: true };
}

function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  const origin = req.headers.origin;
  if (origin && ['https://xikaixi.cn', 'https://www.xikaixi.cn', 'http://localhost:5173'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action as string | undefined;

  switch (req.method) {
    case 'POST':
      if (action === 'forgot') {
        return handleForgotPassword(req, res);
      } else if (action === 'reset') {
        return handleResetPassword(req, res);
      }
      return handleLogin(req, res);
    case 'GET':
      return handleMe(req, res);
    case 'PUT':
      return handleChangePassword(req, res);
    default:
      return res.status(405).json({ error: '方法不允许' });
  }
}

// POST /api/auth - 登录
async function handleLogin(req: VercelRequest, res: VercelResponse) {
  const credentials = resolveLoginAccount(req.body);
  if (!credentials) {
    return res.status(400).json({ success: false, error: '请输入用户名和密码', code: 'MISSING_CREDENTIALS' });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ success: false, error: '服务器配置错误', code: 'CONFIG_ERROR' });
  }

  const clientIP = getClientIP(req);
  let rateLimitEnabled = true;

  try {
    // Rate limiting
    try {
      const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
      const failedAttempts = await prisma.loginAttempt.count({
        where: { ip: clientIP, success: false, createdAt: { gte: windowStart } },
      });

      if (failedAttempts >= RATE_LIMIT_MAX_ATTEMPTS) {
        return res.status(429).json({ success: false, error: '尝试次数过多，请5分钟后再试', code: 'RATE_LIMITED' });
      }
    } catch (e: any) {
      if (e.code === 'P2021' || e.code === 'P2022') {
        rateLimitEnabled = false;
      } else {
        throw e;
      }
    }

    const normalizedAccount = credentials.account.toLowerCase();
    const useEmail = normalizedAccount.includes('@');

    const admin = await prisma.admin.findFirst({
      where: useEmail
        ? { email: normalizedAccount }
        : { username: normalizedAccount },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        role: true,
        tokenVersion: true,
      },
    });

    if (!admin) {
      if (rateLimitEnabled) {
        try {
          await prisma.loginAttempt.create({ data: { ip: clientIP, success: false } });
        } catch {}
      }
      return res.status(401).json({ success: false, error: '用户名或密码错误', code: 'INVALID_CREDENTIALS' });
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, admin.passwordHash);
    if (!isPasswordValid) {
      if (rateLimitEnabled) {
        try {
          await prisma.loginAttempt.create({ data: { ip: clientIP, success: false } });
        } catch {}
      }
      return res.status(401).json({ success: false, error: '用户名或密码错误', code: 'INVALID_CREDENTIALS' });
    }

    if (rateLimitEnabled) {
      try {
        await prisma.loginAttempt.create({ data: { ip: clientIP, success: true } });
        // Cleanup old records
        const cleanupDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        await prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: cleanupDate } } });
      } catch {}
    }

    const token = jwt.sign(
      {
        userId: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        tokenVersion: admin.tokenVersion,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        expiresIn: JWT_EXPIRES_IN,
        user: { id: admin.id, username: admin.username, role: admin.role },
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: '服务器内部错误', code: error.code || 'UNKNOWN' });
  }
}

// POST /api/auth?action=forgot - 忘记密码
async function handleForgotPassword(req: VercelRequest, res: VercelResponse) {
  const { email } = req.body || {};
  const clientIP = getClientIP(req);

  // 统一响应消息（防止枚举攻击）
  const successMessage = '如果该邮箱已注册，我们已发送重置密码链接，请查收邮件';

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, error: '请输入邮箱地址' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Rate limiting for password reset
    try {
      const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
      const resetAttempts = await prisma.passwordResetAttempt.count({
        where: { ip: clientIP, createdAt: { gte: windowStart } },
      });

      if (resetAttempts >= RESET_RATE_LIMIT_MAX) {
        return res.status(429).json({ success: false, error: '请求过于频繁，请稍后再试' });
      }

      // Record this attempt
      await prisma.passwordResetAttempt.create({
        data: { ip: clientIP, email: normalizedEmail },
      });
    } catch (e: any) {
      // If table doesn't exist, continue without rate limiting
      if (e.code !== 'P2021' && e.code !== 'P2022') {
        console.error('Rate limit error:', e);
      }
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, username: true },
    });

    // Always return success to prevent email enumeration
    if (!admin) {
      console.log(`Password reset requested for non-existent email: ${normalizedEmail}`);
      return res.status(200).json({ success: true, message: successMessage });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenHash = hashToken(resetToken);
    const resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000);

    // Save hashed token to database
    await prisma.admin.update({
      where: { id: admin.id },
      data: { resetTokenHash, resetTokenExpiresAt },
    });

    // Generate reset URL
    const resetUrl = `${SITE_URL}/admin/reset-password?token=${resetToken}`;

    // Log the reset URL (in production, this should send an email)
    console.log(`Password reset requested for ${admin.email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Token expires at: ${resetTokenExpiresAt.toISOString()}`);

    // TODO: Send email with resetUrl
    // In production, integrate with an email service like SendGrid, Resend, etc.
    // For now, we log the URL for testing purposes

    return res.status(200).json({
      success: true,
      message: successMessage,
      // Only include debug info in development
      ...(process.env.NODE_ENV === 'development' && { debugResetUrl: resetUrl }),
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return serverError(res, '请求处理失败，请稍后重试');
  }
}

// POST /api/auth?action=reset - 重置密码
async function handleResetPassword(req: VercelRequest, res: VercelResponse) {
  const { token, newPassword } = req.body || {};

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ success: false, error: '无效的重置链接' });
  }

  if (!newPassword || typeof newPassword !== 'string') {
    return res.status(400).json({ success: false, error: '请输入新密码' });
  }

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    return res.status(400).json({ success: false, error: passwordValidation.message });
  }

  try {
    const tokenHash = hashToken(token);
    const now = new Date();

    // Find admin with valid reset token
    const admin = await prisma.admin.findFirst({
      where: {
        resetTokenHash: tokenHash,
        resetTokenExpiresAt: { gt: now },
      },
      select: { id: true, tokenVersion: true },
    });

    if (!admin) {
      return res.status(400).json({ success: false, error: '重置链接无效或已过期' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password and invalidate reset token + all existing sessions
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        passwordHash,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
        tokenVersion: admin.tokenVersion + 1, // Invalidate all existing tokens
      },
    });

    return res.status(200).json({
      success: true,
      message: '密码已重置，请使用新密码登录',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return serverError(res, '密码重置失败，请稍后重试');
  }
}

// GET /api/auth - 获取当前登录用户信息
async function handleMe(req: VercelRequest, res: VercelResponse) {
  const auth = await authenticateRequest(req);
  if (!auth.authenticated || !auth.admin) {
    return unauthorized(res, auth.error);
  }

  return json(res, {
    id: auth.admin.id,
    username: auth.admin.username,
    email: auth.admin.email,
    role: auth.admin.role,
  });
}

// PUT /api/auth - 修改密码
async function handleChangePassword(req: VercelRequest, res: VercelResponse) {
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
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: '请输入当前密码和新密码', code: 'MISSING_FIELDS' });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ success: false, error: passwordValidation.message, code: 'WEAK_PASSWORD' });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.userId },
      select: { id: true, passwordHash: true, tokenVersion: true },
    });

    if (!admin) {
      return res.status(404).json({ success: false, error: '用户不存在', code: 'NOT_FOUND' });
    }

    if (admin.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ success: false, error: '登录已失效，请重新登录', code: 'TOKEN_REVOKED' });
    }

    const isValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: '当前密码错误', code: 'WRONG_PASSWORD' });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, error: '新密码不能与当前密码相同', code: 'SAME_PASSWORD' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: decoded.userId },
      data: {
        passwordHash: newPasswordHash,
        tokenVersion: admin.tokenVersion + 1,
      },
    });

    return res.status(200).json({
      success: true,
      message: '密码修改成功，请重新登录',
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    return serverError(res, '修改密码失败，请稍后重试');
  }
}
