/**
 * 登录接口 - 独立版本（不依赖外部 lib）
 * POST /api/login
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: '方法不允许' });
  }

  const { username, password, account, email } = req.body || {};
  const loginAccount = username || account || email;

  if (!loginAccount || !password) {
    return res.status(400).json({ success: false, error: '请输入用户名和密码' });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ success: false, error: '服务器配置错误: JWT_SECRET 未设置' });
  }

  try {
    const normalizedAccount = String(loginAccount).toLowerCase().trim();
    const isEmail = normalizedAccount.includes('@');

    const admin = await prisma.admin.findFirst({
      where: isEmail
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
      return res.status(401).json({ success: false, error: '用户名或密码错误' });
    }

    const isPasswordValid = await bcrypt.compare(String(password), admin.passwordHash);
    if (!isPasswordValid) {
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
    return res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  } finally {
    await prisma.$disconnect();
  }
}
