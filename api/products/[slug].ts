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
    const slug = req.query.slug as string;

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' });
    }

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    try {
      const product = await prisma.product.findUnique({
        where: { slug },
      });

      await prisma.$disconnect();

      if (!product || !product.active) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json(formatProduct(product));
    } catch (dbError) {
      await prisma.$disconnect().catch(() => {});
      throw dbError;
    }
  } catch (err: any) {
    console.error('Product API error:', err);
    return res.status(500).json({ error: `Server error: ${err.message}` });
  }
}
