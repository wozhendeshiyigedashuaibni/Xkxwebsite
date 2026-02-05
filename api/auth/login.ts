// api/auth/login.ts - Compatibility route for /api/auth/login
// Forwards to the main login logic
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  const origin = req.headers.origin;
  if (origin && ['https://xikaixi.cn', 'https://www.xikaixi.cn'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required', code: 'MISSING_CREDENTIALS' });
    }
    
    // Check JWT_SECRET
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ success: false, error: 'Server configuration error', code: 'JWT_SECRET_MISSING' });
    }
    
    // Dynamic Prisma import
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const admin = await prisma.admin.findUnique({
      where: { username: String(username) },
    });
    
    await prisma.$disconnect();
    
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials', code: 'USER_NOT_FOUND' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials', code: 'INVALID_PASSWORD' });
    }
    
    const token = jwt.sign(
      { userId: admin.id, username: admin.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
    );
    
    return res.status(200).json({
      success: true,
      data: {
        token,
        expiresIn: JWT_EXPIRES_IN,
        user: {
          id: admin.id,
          username: admin.username,
          role: 'admin',
        },
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      code: error.code || 'UNKNOWN',
    });
  }
}
