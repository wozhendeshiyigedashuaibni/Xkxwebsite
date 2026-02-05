// api/test-import.ts
// 测试导入链
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const results: any = {
    timestamp: new Date().toISOString(),
    imports: {},
  };

  try {
    // Test 1: getPrisma import
    const { getPrisma } = await import('./lib/prisma');
    results.imports.prisma = 'success';

    // Test 2: cors import
    const { withCors } = await import('./lib/cors');
    results.imports.cors = 'success';

    // Test 3: response import
    const { successResponse } = await import('./lib/response');
    results.imports.response = 'success';

    // Test 4: getPrisma execution
    const prisma = await getPrisma();
    results.imports.prismaClient = 'success';

    // Test 5: query
    const count = await prisma.product.count();
    results.productCount = count;

    res.status(200).json({ success: true, ...results });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      ...results,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 8),
      },
    });
  }
}
