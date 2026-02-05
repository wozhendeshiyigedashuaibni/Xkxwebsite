// api/products/[slug].ts
// 获取产品详情（公开 API）
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../lib/prisma';
import { withCors } from '../lib/cors';
import { successResponse, errorResponse, handleError } from '../lib/response';

async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return errorResponse(res, 'Method not allowed', 405);
  }
  
  try {
    const prisma = await getPrisma();
    const { slug } = req.query;
    
    if (!slug || typeof slug !== 'string') {
      return errorResponse(res, 'Invalid slug parameter', 400);
    }
    
    // 查询产品
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }
    
    // 检查产品是否激活
    if (!product.active) {
      return errorResponse(res, 'Product not available', 404);
    }
    
    // 解析 JSON 字段
    const parsedProduct = {
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
      customOptions: typeof product.customOptions === 'string' 
        ? JSON.parse(product.customOptions) 
        : product.customOptions,
      tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
    };
    
    return successResponse(res, parsedProduct);
    
  } catch (error) {
    return handleError(res, error);
  }
}

export default withCors(handler);
