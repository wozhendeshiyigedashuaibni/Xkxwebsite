import type { VercelRequest, VercelResponse } from '@vercel/node';

// Format product JSON fields
function formatProduct(product: any) {
  return {
    ...product,
    images: JSON.parse(product.images || '[]'),
    customOptions: JSON.parse(product.customOptions || '[]'),
    tags: JSON.parse(product.tags || '[]'),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    try {
      const { category, featured } = req.query;

      const where: any = { active: true };
      if (category) where.category = category;
      if (featured === 'true') where.featured = true;

      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      await prisma.$disconnect();

      return res.status(200).json(products.map(formatProduct));
    } catch (dbError) {
      await prisma.$disconnect().catch(() => {});
      throw dbError;
    }
  } catch (err: any) {
    console.error('Products API error:', err);
    return res.status(500).json({ error: `Server error: ${err.message}` });
  }
}
