// api/test-products.ts
// 简化版产品API - 用于测试
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 动态导入Prisma
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const products = await prisma.product.findMany({
      where: { active: true },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
      },
      take: 10,
    });

    await prisma.$disconnect();

    res.status(200).json({
      success: true,
      data: { products },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 5),
    });
  }
}
