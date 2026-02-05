// api/leads/index.ts
// 提交询盘（公开 API）
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../lib/prisma';
import { withCors } from '../lib/cors';
import { rateLimit, RATE_LIMITS } from '../lib/rate-limit';
import { successResponse, errorResponse, handleError } from '../lib/response';

async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return errorResponse(res, 'Method not allowed', 405);
  }
  
  try {
    const prisma = await getPrisma();
    
    // 速率限制
    const ip = req.headers['x-forwarded-for'] as string || 'unknown';
    const rateLimitResult = rateLimit(`leads:${ip}`, RATE_LIMITS.api.limit, RATE_LIMITS.api.window);
    
    if (!rateLimitResult.success) {
      return errorResponse(res, 'Too many requests. Please try again later.', 429);
    }
    
    // 验证必填字段
    const { name, email, message, company, phone, files } = req.body;
    
    if (!name || !email || !message) {
      return errorResponse(res, 'Name, email, and message are required', 400);
    }
    
    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 'Invalid email format', 400);
    }
    
    // 创建询盘
    const lead = await prisma.lead.create({
      data: {
        name: String(name).substring(0, 100),
        email: String(email).substring(0, 100),
        message: String(message).substring(0, 5000),
        company: company ? String(company).substring(0, 100) : null,
        phone: phone ? String(phone).substring(0, 50) : null,
        files: files ? JSON.stringify(files) : null,
        status: 'new',
      },
    });
    
    return successResponse(res, {
      id: lead.id,
      message: 'Your inquiry has been submitted successfully. We will contact you soon.',
    }, 201);
    
  } catch (error) {
    return handleError(res, error);
  }
}

export default withCors(handler);
