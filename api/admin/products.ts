// api/admin/products.ts - Admin products CRUD endpoint
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100) + '-' + Date.now().toString(36);
}

// Verify JWT and return decoded payload or null
function verifyAuth(req: VercelRequest): { userId: number; username: string } | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  try {
    return jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  const origin = req.headers.origin;
  if (origin && ['https://xikaixi.cn', 'https://www.xikaixi.cn'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Check JWT_SECRET configuration
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not configured');
    return res.status(500).json({ success: false, error: 'Server configuration error', code: 'JWT_SECRET_MISSING' });
  }
  
  // Verify authentication
  const user = verifyAuth(req);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized', code: 'INVALID_TOKEN' });
  }
  
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // GET - List all products
    if (req.method === 'GET') {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
      await prisma.$disconnect();
      
      // Parse JSON fields
      const parsed = products.map((p: any) => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
        tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
        customOptions: typeof p.customOptions === 'string' ? JSON.parse(p.customOptions) : p.customOptions,
      }));
      
      return res.status(200).json(parsed);
    }
    
    // POST - Create new product
    if (req.method === 'POST') {
      const body = req.body;
      
      if (!body.title || !body.category) {
        await prisma.$disconnect();
        return res.status(400).json({ success: false, error: 'Title and category are required', code: 'MISSING_FIELDS' });
      }
      
      const slug = body.slug || generateSlug(body.title);
      
      // Check slug uniqueness
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) {
        await prisma.$disconnect();
        return res.status(400).json({ success: false, error: 'Slug already exists', code: 'DUPLICATE_SLUG' });
      }
      
      const product = await prisma.product.create({
        data: {
          slug,
          title: body.title,
          category: body.category,
          subcategory: body.subcategory || null,
          mainImage: body.mainImage || '/placeholder.jpg',
          images: JSON.stringify(body.images || []),
          description: body.description || '',
          moq: body.moq || '50 pcs',
          sampleLeadTime: body.sampleLeadTime || '7-10 days',
          bulkLeadTime: body.bulkLeadTime || '4-6 weeks',
          material: body.material || '',
          process: body.process || '',
          capacity: body.capacity || '',
          packaging: body.packaging || '',
          customOptions: JSON.stringify(body.customOptions || []),
          tags: JSON.stringify(body.tags || []),
          price: body.price || null,
          featured: body.featured || false,
          active: body.active !== undefined ? body.active : true,
        },
      });
      
      await prisma.$disconnect();
      
      return res.status(201).json({
        success: true,
        data: {
          ...product,
          images: JSON.parse(product.images),
          tags: JSON.parse(product.tags),
          customOptions: JSON.parse(product.customOptions),
        },
      });
    }
    
    // PUT - Update product (expects id in query or body)
    if (req.method === 'PUT') {
      const id = parseInt(req.query.id as string || req.body.id);
      
      if (!id || isNaN(id)) {
        await prisma.$disconnect();
        return res.status(400).json({ success: false, error: 'Product ID is required', code: 'MISSING_ID' });
      }
      
      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) {
        await prisma.$disconnect();
        return res.status(404).json({ success: false, error: 'Product not found', code: 'NOT_FOUND' });
      }
      
      const body = req.body;
      const updateData: any = {};
      
      // Only update provided fields
      if (body.title !== undefined) updateData.title = body.title;
      if (body.slug !== undefined) updateData.slug = body.slug;
      if (body.category !== undefined) updateData.category = body.category;
      if (body.subcategory !== undefined) updateData.subcategory = body.subcategory;
      if (body.mainImage !== undefined) updateData.mainImage = body.mainImage;
      if (body.images !== undefined) updateData.images = JSON.stringify(body.images);
      if (body.description !== undefined) updateData.description = body.description;
      if (body.moq !== undefined) updateData.moq = body.moq;
      if (body.sampleLeadTime !== undefined) updateData.sampleLeadTime = body.sampleLeadTime;
      if (body.bulkLeadTime !== undefined) updateData.bulkLeadTime = body.bulkLeadTime;
      if (body.material !== undefined) updateData.material = body.material;
      if (body.process !== undefined) updateData.process = body.process;
      if (body.capacity !== undefined) updateData.capacity = body.capacity;
      if (body.packaging !== undefined) updateData.packaging = body.packaging;
      if (body.customOptions !== undefined) updateData.customOptions = JSON.stringify(body.customOptions);
      if (body.tags !== undefined) updateData.tags = JSON.stringify(body.tags);
      if (body.price !== undefined) updateData.price = body.price;
      if (body.featured !== undefined) updateData.featured = body.featured;
      if (body.active !== undefined) updateData.active = body.active;
      
      const product = await prisma.product.update({
        where: { id },
        data: updateData,
      });
      
      await prisma.$disconnect();
      
      return res.status(200).json({
        success: true,
        data: {
          ...product,
          images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
          tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags,
          customOptions: typeof product.customOptions === 'string' ? JSON.parse(product.customOptions) : product.customOptions,
        },
      });
    }
    
    // DELETE - Delete or soft-delete product
    if (req.method === 'DELETE') {
      const id = parseInt(req.query.id as string || req.body.id);
      const soft = req.query.soft === 'true' || req.body.soft === true;
      
      if (!id || isNaN(id)) {
        await prisma.$disconnect();
        return res.status(400).json({ success: false, error: 'Product ID is required', code: 'MISSING_ID' });
      }
      
      const existing = await prisma.product.findUnique({ where: { id } });
      if (!existing) {
        await prisma.$disconnect();
        return res.status(404).json({ success: false, error: 'Product not found', code: 'NOT_FOUND' });
      }
      
      if (soft) {
        // Soft delete - set active to false
        await prisma.product.update({
          where: { id },
          data: { active: false },
        });
        await prisma.$disconnect();
        return res.status(200).json({ success: true, message: 'Product deactivated' });
      } else {
        // Hard delete
        await prisma.product.delete({ where: { id } });
        await prisma.$disconnect();
        return res.status(200).json({ success: true, message: 'Product deleted' });
      }
    }
    
    await prisma.$disconnect();
    return res.status(405).json({ success: false, error: 'Method not allowed' });
    
  } catch (error: any) {
    console.error('Admin products error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Database error',
      message: error.message,
      code: 'DB_ERROR'
    });
  }
}
