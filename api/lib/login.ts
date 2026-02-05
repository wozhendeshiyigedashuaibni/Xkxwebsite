// api/auth/login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../lib/prisma';
import { comparePassword, generateToken } from '../lib/auth';
import { withCors } from '../lib/cors';
import { successResponse, errorResponse, handleError } from '../lib/response';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return errorResponse(res, 'Method not allowed', 405);
  }
  
  try {
    const prisma = await getPrisma();
    const { username, password } = req.body;
    
    if (!username || !password) {
      return errorResponse(res, 'Username and password are required', 400);
    }
    
    const admin = await prisma.admin.findUnique({
      where: { username },
    });
    
    if (!admin) {
      return errorResponse(res, 'Invalid credentials', 401);
    }
    
    const isPasswordValid = await comparePassword(password, admin.password);
    
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }
    
    const token = generateToken({
      userId: admin.id,
      username: admin.username,
      role: 'admin',
    });
    
    return successResponse(res, {
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: 'admin',
      },
    });
    
  } catch (error) {
    return handleError(res, error);
  }
}

export default withCors(handler);