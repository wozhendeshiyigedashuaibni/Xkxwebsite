import type { VercelRequest, VercelResponse } from '@vercel/node';

// Set JSON content type for all responses
function sendJson(res: VercelResponse, data: unknown, status = 200) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).json(data);
}

function sendError(res: VercelResponse, message: string, status = 400) {
  res.setHeader('Content-Type', 'application/json');
  res.status(status).json({ error: message });
}

function setCors(req: VercelRequest, res: VercelResponse): boolean {
  const allowedOrigins = [
    'https://xikaixi.cn',
    'https://www.xikaixi.cn',
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://xikaixi.cn');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Always set content type
  res.setHeader('Content-Type', 'application/json');

  try {
    // Handle CORS
    if (setCors(req, res)) return;

    // Only allow POST
    if (req.method !== 'POST') {
      return sendError(res, 'Method not allowed', 405);
    }

    const { username, password } = req.body || {};

    if (!username || !password) {
      return sendError(res, 'Username and password are required', 400);
    }

    // Dynamic imports to handle serverless cold start
    const { PrismaClient } = await import('@prisma/client');
    const bcrypt = await import('bcryptjs');
    const jwt = await import('jsonwebtoken');

    const prisma = new PrismaClient();

    try {
      // Find admin user
      const admin = await prisma.admin.findUnique({
        where: { username },
      });

      if (!admin) {
        await prisma.$disconnect();
        return sendError(res, 'Invalid credentials', 401);
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        await prisma.$disconnect();
        return sendError(res, 'Invalid credentials', 401);
      }

      // Generate JWT token
      const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      await prisma.$disconnect();

      return sendJson(res, {
        token,
        username: admin.username,
      });
    } catch (dbError) {
      await prisma.$disconnect().catch(() => {});
      throw dbError;
    }
  } catch (err: any) {
    console.error('Login error:', err);
    return sendError(res, `Server error: ${err.message || 'Unknown error'}`, 500);
  }
}
