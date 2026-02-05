// api/lib/response.ts
// 统一的 API 响应格式
import type { VercelResponse } from '@vercel/node';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 成功响应
 */
export function successResponse<T>(res: VercelResponse, data: T, statusCode: number = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  } as ApiResponse<T>);
}

/**
 * 错误响应
 */
export function errorResponse(
  res: VercelResponse,
  error: string,
  statusCode: number = 400,
  details?: any
) {
  const response: ApiResponse = {
    success: false,
    error,
  };
  
  // 开发环境返回详细错误信息
  if (process.env.NODE_ENV === 'development' && details) {
    response.message = details.message || String(details);
  }
  
  return res.status(statusCode).json(response);
}

/**
 * 通用错误处理
 */
export function handleError(res: VercelResponse, error: any) {
  console.error('API Error:', error);
  
  // Prisma 错误
  if (error.code?.startsWith('P')) {
    return errorResponse(res, 'Database error', 500, error);
  }
  
  // JWT 错误
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return errorResponse(res, 'Invalid or expired token', 401, error);
  }
  
  // 验证错误
  if (error.name === 'ValidationError') {
    return errorResponse(res, error.message, 400, error);
  }
  
  // 默认错误
  return errorResponse(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    500,
    error
  );
}
