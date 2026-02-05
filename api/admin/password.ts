// api/admin/password.ts - Change admin password
import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  const origin = req.headers.origin;
  if (origin && ['https://xikaixi.cn', 'https://www.xikaixi.cn'].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  if (!JWT_SECRET) {
    return res.status(500).json({ success: false, error: 'Server configuration error', code: 'JWT_SECRET_MISSING' });
  }
  
  // Verify JWT token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized', code: 'NO_TOKEN' });
  }
  
  let userId: number;
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
    userId = decoded.userId;
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid token', code: 'INVALID_TOKEN' });
  }
  
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current and new password are required', code: 'MISSING_FIELDS' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'New password must be at least 8 characters', code: 'WEAK_PASSWORD' });
    }
    
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const admin = await prisma.admin.findUnique({ where: { id: userId } });
    
    if (!admin) {
      await prisma.$disconnect();
      return res.status(404).json({ success: false, error: 'Admin not found', code: 'NOT_FOUND' });
    }
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) {
      await prisma.$disconnect();
      return res.status(401).json({ success: false, error: 'Current password is incorrect', code: 'WRONG_PASSWORD' });
    }
    
    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    
    await prisma.$disconnect();
    
    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      code: 'UNKNOWN',
    });
  }
}
