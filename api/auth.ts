/**
 * 认证统一接口（独立版本 - 不依赖外部 lib）
 *
 * POST /api/auth - 登录（用户名+密码）
 * POST /api/auth?action=forgot - 忘记密码
 * POST /api/auth?action=reset - 重置密码
 * GET /api/auth - 获取当前用户信息
 * PUT /api/auth - 修改密码
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SITE_URL = process.env.SITE_URL || 'https://xikaixi.cn';

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action as string | undefined;

  try {
    switch (req.method) {
      case 'POST':
        if (action === 'forgot') return handleForgot(req, res);
        if (action === 'reset') return handleReset(req, res);
        return handleLogin(req, res);
      case 'GET':
        return handleMe(req, res);
      case 'PUT':
        return handleChangePassword(req, res);
      default:
        return res.status(405).json({ error: '方法不允许' });
    }
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/auth - 登录
async function handleLogin(req: VercelRequest, res: VercelResponse) {
  const { username, password, account, email } = req.body || {};
  const loginAccount = username || account || email;

  if (!loginAccount || !password) {
    return res.status(400).json({ success: false, error: '请输入用户名和密码' });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ success: false, error: '服务器配置错误' });
  }

  const normalized = String(loginAccount).toLowerCase().trim();
  const isEmail = normalized.includes('@');

  const admin = await prisma.admin.findFirst({
    where: isEmail ? { email: normalized } : { username: normalized },
  });

  if (!admin || !(await bcrypt.compare(String(password), admin.passwordHash))) {
    return res.status(401).json({ success: false, error: '用户名或密码错误' });
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
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.status(200).json({
    success: true,
    data: {
      token,
      expiresIn: JWT_EXPIRES_IN,
      user: { id: admin.id, username: admin.username, role: admin.role },
    },
  });
}

// POST /api/auth?action=forgot - 忘记密码
async function handleForgot(req: VercelRequest, res: VercelResponse) {
  const { email } = req.body || {};
  const successMsg = '如果该邮箱已注册，我们已发送重置密码链接';

  if (!email) {
    return res.status(400).json({ success: false, error: '请输入邮箱地址' });
  }

  const admin = await prisma.admin.findUnique({
    where: { email: String(email).toLowerCase().trim() },
  });

  // Always return success to prevent email enumeration
  if (!admin) {
    return res.status(200).json({ success: true, message: successMsg });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = hashToken(resetToken);
  const resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.admin.update({
    where: { id: admin.id },
    data: { resetTokenHash, resetTokenExpiresAt },
  });

  const resetUrl = `${SITE_URL}/admin/reset-password?token=${resetToken}`;
  console.log(`Password reset for ${admin.email}: ${resetUrl}`);

  return res.status(200).json({ success: true, message: successMsg });
}

// POST /api/auth?action=reset - 重置密码
async function handleReset(req: VercelRequest, res: VercelResponse) {
  const { token, newPassword } = req.body || {};

  if (!token || !newPassword) {
    return res.status(400).json({ success: false, error: '参数不完整' });
  }

  if (String(newPassword).length < 8) {
    return res.status(400).json({ success: false, error: '密码至少8个字符' });
  }

  const tokenHash = hashToken(String(token));
  const admin = await prisma.admin.findFirst({
    where: {
      resetTokenHash: tokenHash,
      resetTokenExpiresAt: { gt: new Date() },
    },
  });

  if (!admin) {
    return res.status(400).json({ success: false, error: '重置链接无效或已过期' });
  }

  const passwordHash = await bcrypt.hash(String(newPassword), 10);
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      passwordHash,
      resetTokenHash: null,
      resetTokenExpiresAt: null,
      tokenVersion: admin.tokenVersion + 1,
    },
  });

  return res.status(200).json({ success: true, message: '密码已重置，请使用新密码登录' });
}

// GET /api/auth - 获取当前用户
async function handleMe(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ') || !JWT_SECRET) {
    return res.status(401).json({ error: '未登录' });
  }

  try {
    const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET) as any;
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true, role: true, tokenVersion: true },
    });

    if (!admin || admin.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ error: '登录已失效' });
    }

    return res.status(200).json({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });
  } catch {
    return res.status(401).json({ error: '令牌无效' });
  }
}

// PUT /api/auth - 修改密码
async function handleChangePassword(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ') || !JWT_SECRET) {
    return res.status(401).json({ success: false, error: '请先登录' });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(authHeader.slice(7), JWT_SECRET);
  } catch {
    return res.status(401).json({ success: false, error: '登录已过期' });
  }

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: '请输入当前密码和新密码' });
  }

  if (String(newPassword).length < 8) {
    return res.status(400).json({ success: false, error: '新密码至少8个字符' });
  }

  const admin = await prisma.admin.findUnique({ where: { id: decoded.userId } });
  if (!admin || admin.tokenVersion !== decoded.tokenVersion) {
    return res.status(401).json({ success: false, error: '登录已失效' });
  }

  if (!(await bcrypt.compare(String(currentPassword), admin.passwordHash))) {
    return res.status(401).json({ success: false, error: '当前密码错误' });
  }

  const passwordHash = await bcrypt.hash(String(newPassword), 10);
  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash, tokenVersion: admin.tokenVersion + 1 },
  });

  return res.status(200).json({ success: true, message: '密码修改成功，请重新登录' });
}
