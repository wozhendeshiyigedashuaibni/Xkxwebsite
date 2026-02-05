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

  const id = parseInt(req.query.id as string);
  if (isNaN(id)) {
    return error(res, 'Invalid product ID', 400);
  }

  try {
    // GET - Get single product
    if (req.method === 'GET') {
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        return error(res, 'Product not found', 404);
      }
      return json(res, formatProduct(product));
    }

    // PUT - Update product
    if (req.method === 'PUT') {
      const existingProduct = await prisma.product.findUnique({ where: { id } });
      if (!existingProduct) {
        return error(res, 'Product not found', 404);
      }

      const data = { ...req.body };

      // Convert arrays to JSON strings
      if (Array.isArray(data.images)) data.images = JSON.stringify(data.images);
      if (Array.isArray(data.customOptions)) data.customOptions = JSON.stringify(data.customOptions);
      if (Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags);

      // Convert boolean
      if (typeof data.featured === 'string') data.featured = data.featured === 'true';
      if (typeof data.active === 'string') data.active = data.active === 'true';

      const product = await prisma.product.update({
        where: { id },
        data,
      });

      return json(res, formatProduct(product));
    }

    // DELETE - Delete product
    if (req.method === 'DELETE') {
      const existingProduct = await prisma.product.findUnique({ where: { id } });
      if (!existingProduct) {
        return error(res, 'Product not found', 404);
      }

      await prisma.product.delete({ where: { id } });
      return json(res, { message: 'Product deleted successfully', id });
    }

    return error(res, 'Method not allowed', 405);
  } catch (err: any) {
    console.error('Product API error:', err);
    if (err.code === 'P2002') {
      return error(res, 'Product with this slug already exists', 400);
    }
    return error(res, 'Server error', 500);
  }
}
