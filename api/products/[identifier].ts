/**
 * 产品详情接口
 * GET /api/products/:identifier
 *
 * identifier 可以是数字 ID 或 slug 字符串
 * 仅返回 active=true 的产品
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';
import { formatProduct } from '../lib/formatters';
import { json, notFound, serverError } from '../lib/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const { identifier } = req.query;

  if (!identifier || Array.isArray(identifier)) {
    return notFound(res, '产品标识符无效');
  }

  try {
    let product;

    // 判断 identifier 是数字还是字符串
    const numericId = parseInt(identifier, 10);
    const isNumeric = !isNaN(numericId) && numericId.toString() === identifier;

    if (isNumeric) {
      // 按 ID 查询
      product = await prisma.product.findFirst({
        where: {
          id: numericId,
          active: true,
        },
      });
    } else {
      // 按 slug 查询
      product = await prisma.product.findFirst({
        where: {
          slug: identifier,
          active: true,
        },
      });
    }

    if (!product) {
      return notFound(res, '未找到该产品');
    }

    return json(res, formatProduct(product));
  } catch (error) {
    console.error('获取产品详情失败:', error);
    return serverError(res, '获取产品详情失败，请稍后重试');
  }
}
