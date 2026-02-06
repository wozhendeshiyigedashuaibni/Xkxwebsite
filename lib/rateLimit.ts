/**
 * 简易速率限制器
 * 注意：在 serverless 环境中，这个限制器的效果有限
 * 因为每个函数实例有独立的内存。如需更严格的限制，建议使用 Vercel Edge Config 或 Redis
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// 内存存储（每个 serverless 实例独立）
const store = new Map<string, RateLimitEntry>();

// 清理过期条目
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  windowMs: number;  // 时间窗口（毫秒）
  maxRequests: number;  // 最大请求数
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 }
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup();

  const now = Date.now();
  const key = identifier;
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // 新窗口
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    store.set(key, newEntry);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: newEntry.resetAt,
    };
  }

  // 现有窗口
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

// 获取客户端 IP
export function getClientIP(req: { headers: Record<string, string | string[] | undefined> }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0];
  }
  return req.headers['x-real-ip'] as string || 'unknown';
}
