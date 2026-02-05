// api/auth/me.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../lib/prisma';
import { verifyToken, extractToken } from '../lib/auth';
import { withCors } from '../lib/cors';
import { successResponse, errorResponse, handleError } from '../lib/response';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return errorResponse(res, 'Method not allowed', 405);
  }
  
  try {
    const prisma = await getPrisma();
    const token = extractToken(req.headers.authorization as string);
    
    if (!token) {
      return errorResponse(res, 'No token provided', 401);
    }
    
    const payload = verifyToken(token);
    
    const admin = await prisma.admin.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!admin) {
      return errorResponse(res, 'User not found', 404);
    }
    
    return successResponse(res, {
      id: admin.id,
      username: admin.username,
      role: payload.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    });
    
  } catch (error) {
    return handleError(res, error);
  }
}

export default withCors(handler);