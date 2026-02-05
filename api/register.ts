import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma';

const REGISTER_SECRET = process.env.ADMIN_REGISTER_SECRET || '';
const VERCEL_ENV = process.env.VERCEL_ENV || 'development';
const IS_PRODUCTION = VERCEL_ENV === 'production';

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
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

  try {
    const { username, email, password, registerSecret } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: '请填写用户名、邮箱和密码', code: 'MISSING_FIELDS' });
    }

    const normalizedUsername = normalizeUsername(String(username));
    const normalizedEmail = normalizeEmail(String(email));

    if (!/^[a-z0-9_]{3,32}$/.test(normalizedUsername)) {
      return res.status(400).json({ success: false, error: '用户名需为3-32位，仅支持小写字母、数字、下划线', code: 'INVALID_USERNAME' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ success: false, error: '邮箱格式不正确', code: 'INVALID_EMAIL' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ success: false, error: '密码至少需要8个字符', code: 'WEAK_PASSWORD' });
    }

    if (IS_PRODUCTION && REGISTER_SECRET) {
      if (!registerSecret || String(registerSecret) !== REGISTER_SECRET) {
        return res.status(403).json({ success: false, error: '注册密钥无效', code: 'INVALID_REGISTER_SECRET' });
      }
    }

    const exists = await prisma.admin.findFirst({
      where: {
        OR: [{ username: normalizedUsername }, { email: normalizedEmail }],
      },
      select: { id: true, username: true, email: true },
    });

    if (exists) {
      if (exists.username === normalizedUsername) {
        return res.status(409).json({ success: false, error: '用户名已被占用', code: 'USERNAME_EXISTS' });
      }

      return res.status(409).json({ success: false, error: '邮箱已被使用', code: 'EMAIL_EXISTS' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const admin = await prisma.admin.create({
      data: {
        username: normalizedUsername,
        email: normalizedEmail,
        passwordHash,
        role: 'admin',
      },
      select: { id: true, username: true, email: true, role: true },
    });

    return res.status(201).json({
      success: true,
      data: {
        user: admin,
      },
      message: '管理员注册成功，请返回登录页登录',
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, error: '服务器内部错误', code: error.code || 'UNKNOWN' });
  }
}
