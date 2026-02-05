/**
 * 内容接口
 * GET /api/content/:key
 *
 * 获取指定 key 的内容
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';
import { formatContent } from '../lib/formatters';
import { json, notFound, serverError } from '../lib/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const { key } = req.query;

  if (!key || Array.isArray(key)) {
    return notFound(res, '内容标识符无效');
  }

  try {
    const content = await prisma.content.findUnique({
      where: { key },
    });

    if (!content) {
      return notFound(res, '未找到该内容');
    }

    return json(res, formatContent(content));
  } catch (error) {
    console.error('获取内容失败:', error);
    return serverError(res, '获取内容失败，请稍后重试');
  }
}
