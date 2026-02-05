// api/products/index.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  const origin = req.headers.origin;
  if (origin && ['https://xikaixi.cn', 'https://www.xikaixi.cn'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const { category, featured } = req.query;
    
    const where: any = { active: true };
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;
    
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
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        take: 50,
      }),
    ]);
    
    await prisma.$disconnect();
    
    const parsedProducts = products.map((p: any) => ({
      ...p,
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
    }));
    
    res.status(200).json({
      success: true,
      data: {
        products: parsedProducts,
        pagination: { total, page: 1, limit: 50 },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
