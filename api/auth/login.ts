/**
 * 管理员登录接口
 * POST /api/auth/login
 *
 * 请求体:
 *   - username: 用户名
 *   - password: 密码
 *
 * 包含登录限速: 每 IP 每分钟 5 次尝试
 * 默认密码可登录但返回 requirePasswordChange: true
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { generateToken } from '../lib/auth';
import { checkRateLimit, getClientIP } from '../lib/rateLimit';
import { json, error, unauthorized, tooManyRequests, serverError } from '../lib/response';

// 默认密码列表 - 禁止使用
const BLOCKED_PASSWORDS = ['admin123', 'password', '123456', 'admin', 'password123'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { username, password } = req.body || {};

    // 基本验证
    if (!username || typeof username !== 'string') {
      return error(res, '请输入用户名');
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
    const usernameLimit = checkRateLimit(`login:user:${username.toLowerCase()}`, {
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

    // 检查是否使用默认密码
    const isDefaultPassword = BLOCKED_PASSWORDS.some(blocked =>
      bcrypt.compareSync(blocked, admin.password)
    );

    // 生成 token
    const token = generateToken(admin.id, admin.username);

    return json(res, {
      success: true,
      message: isDefaultPassword ? '登录成功，请立即修改默认密码' : '登录成功',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
      // 如果使用默认密码，前端应强制跳转到密码修改页面
      requirePasswordChange: isDefaultPassword,
    });
  } catch (err) {
    console.error('登录失败:', err);
    return serverError(res, '登录失败，请稍后重试');
  }
}
