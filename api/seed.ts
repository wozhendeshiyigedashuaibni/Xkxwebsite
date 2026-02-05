// api/seed.ts - 数据库初始化（仅开发/预览环境）
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';

const VERCEL_ENV = process.env.VERCEL_ENV || 'development';
const IS_PRODUCTION = VERCEL_ENV === 'production';

function generateUsernameFromEmail(email: string) {
  const prefix = email.split('@')[0]?.trim().toLowerCase();
  return prefix || 'admin';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 生产环境禁止
  if (IS_PRODUCTION) {
    return res.status(403).json({
      success: false,
      error: '生产环境禁止使用 seed 接口',
      code: 'PRODUCTION_BLOCKED'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: '不支持的请求方法' });
  }

  // 需要密钥验证
  const SEED_SECRET = process.env.SEED_SECRET || process.env.JWT_SECRET || '';
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== SEED_SECRET) {
    return res.status(401).json({ success: false, error: '未授权' });
  }

  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: '请提供 email 和 password' });
    }

    const normalizedEmail = String(email).toLowerCase();
    const requestedUsername = String(username || generateUsernameFromEmail(normalizedEmail)).toLowerCase();

    const { prisma } = await import('../lib/server/prisma');

    // 检查是否已存在
    const existing = await prisma.admin.findUnique({
      where: { email: normalizedEmail }
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: '管理员已存在',
        admin: { id: existing.id, email: existing.email, username: existing.username }
      });
    }

    // 创建管理员
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: {
        email: normalizedEmail,
        username: requestedUsername,
        passwordHash,
        role: 'admin',
        tokenVersion: 0,
      }
    });

    return res.status(201).json({
      success: true,
      message: '管理员创建成功',
      admin: { id: admin.id, email: admin.email, username: admin.username, role: admin.role },
      warning: '请妥善保管密码，后续通过忘记密码功能修改'
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return res.status(500).json({ success: false, error: '服务器错误', message: error.message });
  }
}
