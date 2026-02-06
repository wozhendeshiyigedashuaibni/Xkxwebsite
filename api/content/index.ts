/**
 * 内容列表接口
 * GET /api/content
 *
 * 获取所有内容，以 key-value 对象形式返回
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { json, serverError } from '../../lib/response';

// 安全的 JSON 解析
function safeJsonParse(str: string | null | undefined, fallback: any = null) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const contents = await prisma.content.findMany();

    // 转换为 key-value 对象
    const result: Record<string, any> = {};
    for (const content of contents) {
      result[content.key] = safeJsonParse(content.value, content.value);
    }

    return json(res, result);
  } catch (error) {
    console.error('获取内容列表失败:', error);
    return serverError(res, '获取内容失败，请稍后重试');
  }
}
