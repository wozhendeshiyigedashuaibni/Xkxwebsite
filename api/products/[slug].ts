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
    const slug = req.query.slug as string;

    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product || !product.active) {
      return error(res, 'Product not found', 404);
    }

    return json(res, formatProduct(product));
  } catch (err) {
    console.error('Product API error:', err);
    return error(res, 'Server error', 500);
  }
}
