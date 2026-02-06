/**
 * 产品列表接口
 * GET /api/products
 *
 * 查询参数:
 *   - category: 分类筛选
 *   - featured: 是否只返回精选产品 (true/false)
 *
 * 仅返回 active=true 的产品
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';
import { formatProduct } from '../lib/formatters';
import { json, serverError } from '../lib/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { category, featured } = req.query;

    // 构建查询条件
    const where: any = {
      active: true,
    };

    if (category && typeof category === 'string') {
      where.category = category;
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return json(res, products.map(formatProduct));
  } catch (error) {
    console.error('获取产品列表失败:', error);
    return serverError(res, '获取产品列表失败，请稍后重试');
  }
}
