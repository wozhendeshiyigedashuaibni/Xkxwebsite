/**
 * 修改密码接口
 * POST /api/auth/change-password
 *
 * 请求体:
 *   - currentPassword: 当前密码
 *   - newPassword: 新密码 (至少8位，包含字母和数字)
 *
 * 需要认证
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { authenticateRequest } from '../lib/auth';
import { json, error, unauthorized, serverError } from '../lib/response';

// 密码强度验证
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

  // 检查弱密码
  const weakPasswords = ['password', 'admin123', '12345678', 'password123', 'admin888'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return { valid: false, message: '密码过于简单，请使用更复杂的密码' };
  }

  return { valid: true };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  // 验证认证
  const auth = await authenticateRequest(req);
  if (!auth.authenticated || !auth.admin) {
    return unauthorized(res, auth.error);
  }

  try {
    const { currentPassword, newPassword } = req.body || {};

    // 验证输入
    if (!currentPassword || typeof currentPassword !== 'string') {
      return error(res, '请输入当前密码');
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return error(res, '请输入新密码');
    }

    // 验证新密码强度
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return error(res, passwordValidation.message!);
    }

    // 获取管理员信息
    const admin = await prisma.admin.findUnique({
      where: { id: auth.admin.id },
    });

    if (!admin) {
      return error(res, '管理员账户不存在');
    }

    // 验证当前密码
    const isCurrentValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentValid) {
      return error(res, '当前密码错误');
    }

    // 检查新密码是否与旧密码相同
    if (currentPassword === newPassword) {
      return error(res, '新密码不能与当前密码相同');
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await prisma.admin.update({
      where: { id: auth.admin.id },
      data: { password: hashedPassword },
    });

    return json(res, {
      success: true,
      message: '密码修改成功，请使用新密码重新登录',
    });
  } catch (err) {
    console.error('修改密码失败:', err);
    return serverError(res, '修改密码失败，请稍后重试');
  }
}
