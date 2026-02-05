import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import prisma from '../_lib/prisma';
import { signToken } from '../_lib/auth';
import { cors, json, error } from '../_lib/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (cors(req, res)) return;

  // Only allow POST
  if (req.method !== 'POST') {
    return error(res, 'Method not allowed', 405);
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, 'Username and password are required', 400);
    }

    // Find admin user
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return error(res, 'Invalid credentials', 401);
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return error(res, 'Invalid credentials', 401);
    }

    // Generate JWT token
    const token = signToken({ id: admin.id, username: admin.username });

    return json(res, {
      token,
      username: admin.username,
    });
  } catch (err) {
    console.error('Login error:', err);
    return error(res, 'Server error', 500);
  }
}
