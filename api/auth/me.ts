/**
 * 获取当前登录管理员信息
 * GET /api/auth/me
 *
 * 需要认证
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest } from '../lib/auth';
import { json, unauthorized } from '../lib/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  // 验证认证
  const auth = await authenticateRequest(req);
  if (!auth.authenticated || !auth.admin) {
    return unauthorized(res, auth.error);
  }

  return json(res, {
    id: auth.admin.id,
    email: auth.admin.email,
  });
}
