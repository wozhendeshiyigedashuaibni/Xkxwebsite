/**
 * 认证统一接口
 *
 * POST /api/auth - 登录
 * GET /api/auth - 获取当前登录用户信息
 * PUT /api/auth - 修改密码
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { authenticateRequest } from '../lib/auth';
import { json, unauthorized, serverError } from '../lib/response';

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
  const weakPasswords = ['password', 'admin123', '12345678', 'password123', 'admin888'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return { valid: false, message: '密码过于简单，请使用更复杂的密码' };
  }
  return { valid: true };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  const origin = req.headers.origin;
  if (origin && ['https://xikaixi.cn', 'https://www.xikaixi.cn'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  switch (req.method) {
    case 'POST':
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

// GET /api/auth - 获取当前登录用户信息
async function handleMe(req: VercelRequest, res: VercelResponse) {
  const auth = await authenticateRequest(req);
  if (!auth.authenticated || !auth.admin) {
    return unauthorized(res, auth.error);
  }

  return json(res, {
    id: auth.admin.id,
    username: auth.admin.username,
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
