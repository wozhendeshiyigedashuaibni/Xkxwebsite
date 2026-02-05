import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = [
  'https://xikaixi.cn',
  'https://www.xikaixi.cn',
  'http://localhost:5173',
  'http://localhost:3000',
];

export function cors(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin || '';

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}

export function json(res: VercelResponse, data: unknown, status = 200): void {
  res.status(status).json(data);
}

export function error(res: VercelResponse, message: string, status = 400): void {
  res.status(status).json({ error: message });
}
