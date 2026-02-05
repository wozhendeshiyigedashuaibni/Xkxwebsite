import type { VercelRequest, VercelResponse } from '@vercel/node';

// This is a one-time initialization endpoint
// Should be removed or secured after first use
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST required' });
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    const bcrypt = await import('bcryptjs');

    const prisma = new PrismaClient();

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      await prisma.$disconnect();
      return res.status(200).json({
        message: 'Admin already exists',
        username: 'admin'
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });

    await prisma.$disconnect();

    res.status(201).json({
      message: 'Admin created successfully',
      username: admin.username,
      note: 'Default password is admin123 - please change it after first login'
    });
  } catch (err: any) {
    console.error('Init error:', err);
    res.status(500).json({ error: err.message });
  }
}
