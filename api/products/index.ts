// api/products/index.ts
// 获取产品列表（公开 API）
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
    
    // 解析查询参数
    const {
      page = '1',
      limit = '20',
      category,
      featured,
      search,
    } = req.query;
    
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;
    
    // 构建查询条件
    const where: any = {
      active: true, // 只返回激活的产品
    };
    
    if (category) {
      where.category = category;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // 并行查询总数和数据
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
          subcategory: true,
          mainImage: true,
          moq: true,
          price: true,
          featured: true,
          tags: true,
          createdAt: true,
        },
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limitNum,
      }),
    ]);
    
    // 解析 JSON 字段
    const parsedProducts = products.map(product => ({
      ...product,
      tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
    }));
    
    // 返回分页数据
    return successResponse(res, {
      products: parsedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
    
  } catch (error) {
    return handleError(res, error);
  }
}

export default withCors(handler);
