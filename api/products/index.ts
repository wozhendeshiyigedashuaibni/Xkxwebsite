// api/products/index.ts
// 获取产品列表（公开 API）
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { PrismaClient } from '@prisma/client';

// CORS headers
function setCors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin;
  const allowedOrigins = ['https://xikaixi.cn', 'https://www.xikaixi.cn'];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

// Prisma singleton
let prisma: PrismaClient | null = null;

async function getPrisma(): Promise<PrismaClient> {
  if (!prisma) {
    const { PrismaClient: PC } = await import('@prisma/client');
    prisma = new PC();
  }
  return prisma;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (setCors(req, res)) return;
  
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    const db = await getPrisma();
    
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
    
    const where: any = { active: true };
    
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const [total, products] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
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
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limitNum,
      }),
    ]);
    
    const parsedProducts = products.map(product => ({
      ...product,
      tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
    }));
    
    return res.status(200).json({
      success: true,
      data: {
        products: parsedProducts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
