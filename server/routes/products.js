import express from 'express';
import { prisma } from '../prisma.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    
    const where = { active: true };
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const formatted = products.map(p => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      customOptions: JSON.parse(p.customOptions || '[]'),
      tags: JSON.parse(p.tags || '[]')
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: identifier },
          { id: isNaN(identifier) ? undefined : parseInt(identifier) }
        ],
        active: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const formatted = {
      ...product,
      images: JSON.parse(product.images || '[]'),
      customOptions: JSON.parse(product.customOptions || '[]'),
      tags: JSON.parse(product.tags || '[]')
    };

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
