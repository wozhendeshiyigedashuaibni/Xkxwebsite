import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest } from '../_lib/auth';
import { cors, json, error } from '../_lib/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  if (cors(req, res)) return;

  // Only allow GET
  if (req.method !== 'GET') {
    return error(res, 'Method not allowed', 405);
  }

  try {
    const user = authenticateRequest(req);

    if (!user) {
      return error(res, 'Unauthorized', 401);
    }

    return json(res, {
      id: user.id,
      username: user.username,
    });
  } catch (err) {
    console.error('Auth check error:', err);
    return error(res, 'Server error', 500);
  }
}
