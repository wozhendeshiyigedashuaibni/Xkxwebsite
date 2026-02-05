import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../_lib/prisma';
import { authenticateRequest } from '../../_lib/auth';
import { cors, json, error } from '../../_lib/cors';

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

  // Authenticate
  const user = authenticateRequest(req);
  if (!user) {
    return error(res, 'Unauthorized', 401);
  }

  try {
    // GET - List products
    if (req.method === 'GET') {
      const { category, search } = req.query;

      const where: any = {};
      if (category) where.category = category;
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return json(res, products.map(formatProduct));
    }

    // POST - Create product
    if (req.method === 'POST') {
      const data = { ...req.body };

      // Validate required fields
      const requiredFields = ['slug', 'title', 'category', 'mainImage', 'description', 'moq', 'sampleLeadTime', 'bulkLeadTime', 'material', 'process', 'capacity', 'packaging'];
      const missingFields = requiredFields.filter((field) => !data[field]);

      if (missingFields.length > 0) {
        return error(res, `Missing required fields: ${missingFields.join(', ')}`, 400);
      }

      // Convert arrays to JSON strings
      if (Array.isArray(data.images)) data.images = JSON.stringify(data.images);
      if (Array.isArray(data.customOptions)) data.customOptions = JSON.stringify(data.customOptions);
      if (Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags);

      // Set defaults
      if (!data.images) data.images = JSON.stringify([]);
      if (!data.customOptions) data.customOptions = JSON.stringify([]);
      if (!data.tags) data.tags = JSON.stringify([]);

      // Convert boolean
      if (typeof data.featured === 'string') data.featured = data.featured === 'true';
      if (typeof data.active === 'string') data.active = data.active === 'true';
      if (data.featured === undefined) data.featured = false;
      if (data.active === undefined) data.active = true;

      const product = await prisma.product.create({ data });
      return json(res, formatProduct(product), 201);
    }

    return error(res, 'Method not allowed', 405);
  } catch (err: any) {
    console.error('Products API error:', err);
    if (err.code === 'P2002') {
      return error(res, 'Product with this slug already exists', 400);
    }
    return error(res, 'Server error', 500);
  }
}
