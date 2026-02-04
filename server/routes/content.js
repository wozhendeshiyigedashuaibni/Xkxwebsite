import express from 'express';
import { prisma } from '../prisma.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contents = await prisma.content.findMany();
    
    const formatted = contents.reduce((acc, item) => {
      acc[item.key] = JSON.parse(item.value);
      return acc;
    }, {});

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const content = await prisma.content.findUnique({
      where: { key: req.params.key }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(JSON.parse(content.value));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
