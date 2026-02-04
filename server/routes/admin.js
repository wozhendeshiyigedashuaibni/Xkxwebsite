import express from 'express';
import { prisma } from '../index.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);

// ============ PRODUCTS ============
router.get('/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const where = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

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

router.get('/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
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

router.post('/products', async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Convert arrays to JSON strings
    if (Array.isArray(data.images)) data.images = JSON.stringify(data.images);
    if (Array.isArray(data.customOptions)) data.customOptions = JSON.stringify(data.customOptions);
    if (Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags);
    
    // Convert boolean
    if (typeof data.featured === 'string') data.featured = data.featured === 'true';
    if (typeof data.active === 'string') data.active = data.active === 'true';

    const product = await prisma.product.create({ data });

    res.json(product);
  } catch (error) {
    console.error('Product create error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Convert arrays to JSON strings
    if (Array.isArray(data.images)) data.images = JSON.stringify(data.images);
    if (Array.isArray(data.customOptions)) data.customOptions = JSON.stringify(data.customOptions);
    if (Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags);
    
    // Convert boolean
    if (typeof data.featured === 'string') data.featured = data.featured === 'true';
    if (typeof data.active === 'string') data.active = data.active === 'true';

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data
    });

    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ CONTENT ============
router.get('/content', async (req, res) => {
  try {
    const contents = await prisma.content.findMany();
    
    const formatted = contents.map(item => ({
      ...item,
      value: JSON.parse(item.value)
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/content/:key', async (req, res) => {
  try {
    const { value } = req.body;
    
    const content = await prisma.content.upsert({
      where: { key: req.params.key },
      update: { value: JSON.stringify(value) },
      create: { key: req.params.key, value: JSON.stringify(value) }
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ LEADS ============
router.get('/leads', async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = status ? { status } : {};

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const formatted = leads.map(l => ({
      ...l,
      files: JSON.parse(l.files || '[]')
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/leads/:id', async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const formatted = {
      ...lead,
      files: JSON.parse(lead.files || '[]')
    };

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/leads/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const lead = await prisma.lead.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ UPLOAD ============
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
