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
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
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
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
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
    
    // 验证必填字段
    const requiredFields = ['slug', 'title', 'category', 'mainImage', 'description', 'moq', 'sampleLeadTime', 'bulkLeadTime', 'material', 'process', 'capacity', 'packaging'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        fields: missingFields 
      });
    }
    
    // Convert arrays to JSON strings
    if (Array.isArray(data.images)) data.images = JSON.stringify(data.images);
    if (Array.isArray(data.customOptions)) data.customOptions = JSON.stringify(data.customOptions);
    if (Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags);
    
    // 如果没有提供，设置默认值
    if (!data.images) data.images = JSON.stringify([]);
    if (!data.customOptions) data.customOptions = JSON.stringify([]);
    if (!data.tags) data.tags = JSON.stringify([]);
    
    // Convert boolean
    if (typeof data.featured === 'string') data.featured = data.featured === 'true';
    if (typeof data.active === 'string') data.active = data.active === 'true';
    if (data.featured === undefined) data.featured = false;
    if (data.active === undefined) data.active = true;

    const product = await prisma.product.create({ data });

    // 返回格式化的产品
    const formatted = {
      ...product,
      images: JSON.parse(product.images),
      customOptions: JSON.parse(product.customOptions),
      tags: JSON.parse(product.tags)
    };

    res.status(201).json(formatted);
  } catch (error) {
    console.error('Product create error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Product with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // 检查产品是否存在
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
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
      data
    });

    // 返回格式化的产品
    const formatted = {
      ...product,
      images: JSON.parse(product.images),
      customOptions: JSON.parse(product.customOptions),
      tags: JSON.parse(product.tags)
    };

    res.json(formatted);
  } catch (error) {
    console.error('Product update error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Product with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // 检查产品是否存在
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully', id });
  } catch (error) {
    console.error('Product delete error:', error);
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
});

// ============ CONTENT ============
router.get('/content', async (req, res) => {
  try {
    const contents = await prisma.content.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    
    const formatted = contents.map(item => ({
      ...item,
      value: JSON.parse(item.value)
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Failed to fetch content', details: error.message });
  }
});

router.get('/content/:key', async (req, res) => {
  try {
    const content = await prisma.content.findUnique({
      where: { key: req.params.key }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const formatted = {
      ...content,
      value: JSON.parse(content.value)
    };

    res.json(formatted);
  } catch (error) {
    console.error('Get content by key error:', error);
    res.status(500).json({ error: 'Failed to fetch content', details: error.message });
  }
});

router.put('/content/:key', async (req, res) => {
  try {
    const { value } = req.body;
    
    if (value === undefined || value === null) {
      return res.status(400).json({ error: 'Value is required' });
    }
    
    // Validate key format (alphanumeric, dash, underscore, dot)
    const keyPattern = /^[a-zA-Z0-9._-]+$/;
    if (!keyPattern.test(req.params.key)) {
      return res.status(400).json({ 
        error: 'Invalid key format. Use only letters, numbers, dash, underscore, and dot.' 
      });
    }
    
    const content = await prisma.content.upsert({
      where: { key: req.params.key },
      update: { value: JSON.stringify(value) },
      create: { key: req.params.key, value: JSON.stringify(value) }
    });

    const formatted = {
      ...content,
      value: JSON.parse(content.value)
    };

    res.json(formatted);
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Failed to update content', details: error.message });
  }
});

router.delete('/content/:key', async (req, res) => {
  try {
    const existingContent = await prisma.content.findUnique({
      where: { key: req.params.key }
    });

    if (!existingContent) {
      return res.status(404).json({ error: 'Content not found' });
    }

    await prisma.content.delete({
      where: { key: req.params.key }
    });

    res.json({ message: 'Content deleted successfully', key: req.params.key });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Failed to delete content', details: error.message });
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