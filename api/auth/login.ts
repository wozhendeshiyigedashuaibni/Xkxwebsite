/**
 * 管理员登录接口
 * POST /api/auth/login
 *
 * 请求体:
 *   - username: 用户名
 *   - password: 密码
 *
 * 安全措施:
 *   - IP 速率限制: 每分钟 5 次
 *   - 用户名速率限制: 每分钟 3 次
 *   - 弱密码检测
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { generateToken } from '../lib/auth';
import { checkRateLimit, getClientIP } from '../lib/rateLimit';
import { json, error, unauthorized, tooManyRequests, serverError } from '../lib/response';

// 弱密码列表
const WEAK_PASSWORDS = ['admin123', 'password', '123456', 'admin', 'password123', '12345678'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { username, password } = req.body || {};

    // 基本验证
    if (!username || typeof username !== 'string' || username.trim().length < 2) {
      return error(res, '请输入有效的用户名');
    }

    if (!password || typeof password !== 'string') {
      return error(res, '请输入密码');
    }

    // IP 速率限制: 每分钟 5 次
    const clientIP = getClientIP(req);
    const ipLimit = checkRateLimit(`login:ip:${clientIP}`, {
      windowMs: 60 * 1000,
      maxRequests: 5,
    });

    if (!ipLimit.allowed) {
      return tooManyRequests(res, '登录尝试次数过多，请1分钟后再试');
    }

    // 用户名速率限制: 每分钟 3 次
    const usernameNormalized = username.toLowerCase().trim();
    const usernameLimit = checkRateLimit(`login:user:${usernameNormalized}`, {
      windowMs: 60 * 1000,
      maxRequests: 3,
    });

    if (!usernameLimit.allowed) {
      return tooManyRequests(res, '该账户登录尝试次数过多，请1分钟后再试');
    }

    // 查找管理员
    const admin = await prisma.admin.findUnique({
      where: { username: username.trim() },
    });

    if (!admin) {
      return unauthorized(res, '用户名或密码错误');
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return unauthorized(res, '用户名或密码错误');
    }

    // 检查是否使用弱密码
    const isWeakPassword = WEAK_PASSWORDS.some(weak =>
      bcrypt.compareSync(weak, admin.password)
    );

    // 生成 token
    const token = generateToken(admin.id, admin.username);

    return json(res, {
      success: true,
      message: isWeakPassword ? '登录成功，建议修改为更强的密码' : '登录成功',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
      requirePasswordChange: isWeakPassword,
    });
  } catch (err) {
    console.error('登录失败:', err);
    return serverError(res, '登录失败，请稍后重试');
  }
}
