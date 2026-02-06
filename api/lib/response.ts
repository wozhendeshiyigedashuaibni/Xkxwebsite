/**
 * API 响应工具函数
 */

import type { VercelResponse } from '@vercel/node';

export function json(res: VercelResponse, data: any, status = 200) {
  return res.status(status).json(data);
}

export function error(res: VercelResponse, message: string, status = 400) {
  return res.status(status).json({ error: message });
}

export function notFound(res: VercelResponse, message = '资源未找到') {
  return res.status(404).json({ error: message });
}

export function serverError(res: VercelResponse, message = '服务器内部错误') {
  return res.status(500).json({ error: message });
}

export function unauthorized(res: VercelResponse, message = '未授权访问') {
  return res.status(401).json({ error: message });
}

export function tooManyRequests(res: VercelResponse, message = '请求过于频繁，请稍后再试') {
  return res.status(429).json({ error: message });
}
