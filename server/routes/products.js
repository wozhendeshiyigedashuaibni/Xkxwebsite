import express from 'express';
import { prisma } from '../prisma.js';
import { formatProduct, formatProducts } from '../utils/formatters.js';

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

    res.json(formatProducts(products));
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

    res.json(formatProduct(product));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
