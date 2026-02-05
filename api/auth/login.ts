// api/auth/login.ts
// 管理员登录 API
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getPrisma } from '../lib/prisma';
import { comparePassword, generateToken } from '../lib/auth';
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
    
    // 速率限制检查
    const ip = req.headers['x-forwarded-for'] as string || 'unknown';
    const rateLimitResult = rateLimit(`login:${ip}`, RATE_LIMITS.login.limit, RATE_LIMITS.login.window);
    
    if (!rateLimitResult.success) {
      return errorResponse(res, 'Too many login attempts. Please try again later.', 429);
    }
    
    // 验证请求体
    const { username, password } = req.body;
    
    if (!username || !password) {
      return errorResponse(res, 'Username and password are required', 400);
    }
    
    if (typeof username !== 'string' || typeof password !== 'string') {
      return errorResponse(res, 'Invalid input format', 400);
    }
    
    // 查找管理员
    const admin = await prisma.admin.findUnique({
      where: { username },
    });
    
    if (!admin) {
      // 防止用户名枚举攻击 - 返回通用错误信息
      return errorResponse(res, 'Invalid credentials', 401);
    }
    
    // 验证密码
    const isPasswordValid = await comparePassword(password, admin.password);
    
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }
    
    // 生成 JWT Token
    const token = generateToken({
      userId: admin.id,
      username: admin.username,
      role: 'admin', // 当前版本所有用户都是 admin，后续可扩展 RBAC
    });
    
    // 返回成功响应
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

// 导出带 CORS 的处理函数
export default withCors(handler);
