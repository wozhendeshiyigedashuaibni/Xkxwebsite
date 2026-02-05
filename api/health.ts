import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET (hidden)' : 'NOT SET',
      DIRECT_URL: process.env.DIRECT_URL ? 'SET (hidden)' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET (hidden)' : 'NOT SET',
    },
    database: 'pending',
    adminCount: 0,
  };

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Test database connection
    await prisma.$connect();
    checks.database = 'connected';

    // Count admins
    const adminCount = await prisma.admin.count();
    checks.adminCount = adminCount;

    // Get admin usernames (not passwords)
    const admins = await prisma.admin.findMany({
      select: { id: true, username: true, createdAt: true }
    });
    checks.admins = admins;

    await prisma.$disconnect();

    res.status(200).json(checks);
  } catch (err: any) {
    checks.database = 'error';
    checks.error = err.message;
    res.status(500).json(checks);
  }
}
