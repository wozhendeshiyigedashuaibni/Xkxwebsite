import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../_lib/prisma';
import { cors, json, error } from '../_lib/cors';

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
  // Handle CORS
  if (cors(req, res)) return;

  // Only allow GET
  if (req.method !== 'GET') {
    return error(res, 'Method not allowed', 405);
  }

  try {
    const { category, featured } = req.query;

    const where: any = { active: true };
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return json(res, products.map(formatProduct));
  } catch (err) {
    console.error('Products API error:', err);
    return error(res, 'Server error', 500);
  }
}
