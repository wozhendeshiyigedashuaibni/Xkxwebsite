// api/seed.ts - Database seed endpoint
// Only available in development/preview environments
// BLOCKED in production for security
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';

// Vercel sets VERCEL_ENV to 'production', 'preview', or 'development'
const VERCEL_ENV = process.env.VERCEL_ENV || 'development';
const IS_PRODUCTION = VERCEL_ENV === 'production';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // BLOCK in production environment
  if (IS_PRODUCTION) {
    return res.status(403).json({ 
      success: false, 
      error: 'Seed endpoint is disabled in production',
      code: 'PRODUCTION_BLOCKED'
    });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  // Still require a secret in non-production for safety
  const SEED_SECRET = process.env.SEED_SECRET || process.env.JWT_SECRET || '';
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== SEED_SECRET) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid seed secret' });
  }
  
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    });
    
    if (existingAdmin) {
      await prisma.$disconnect();
      return res.status(200).json({
        success: true,
        message: 'Admin user already exists',
        admin: { id: existingAdmin.id, username: existingAdmin.username }
      });
    }
    
    // Create admin user with bcrypt hash (salt rounds = 10)
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword
      }
    });
    
    await prisma.$disconnect();
    
    return res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      admin: { id: admin.id, username: admin.username },
      credentials: {
        username: 'admin',
        password: 'admin123'
      },
      warning: 'Please change the default password immediately!'
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return res.status(500).json({
      success: false,
      error: 'Database error',
      message: error.message
    });
  }
}
