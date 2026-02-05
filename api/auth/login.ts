import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleAdminLogin } from '../../lib/server/admin-auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return handleAdminLogin(req, res);
}
