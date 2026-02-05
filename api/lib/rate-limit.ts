// api/lib/rate-limit.ts
// 简单的内存型限流器（适用于 Vercel Serverless）
// 注意：这是简化版本，生产环境建议使用 @upstash/ratelimit

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// 内存存储（注意：Serverless 函数重启后会重置）
const store = new Map<string, RateLimitRecord>();

/**
 * 速率限制检查
 * @param identifier 标识符（IP、用户ID等）
 * @param limit 时间窗口内的最大请求数
 * @param windowMs 时间窗口（毫秒）
 */
export function rateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = store.get(identifier);
  
  // 如果没有记录或已过期，创建新记录
  if (!record || record.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }
  
  // 增加计数
  record.count++;
  
  // 检查是否超限
  const success = record.count <= limit;
  const remaining = Math.max(0, limit - record.count);
  
  return { success, remaining, resetAt: record.resetAt };
}

/**
 * 清理过期记录（定期调用以避免内存泄漏）
 */
export function cleanupExpiredRecords(): void {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (record.resetAt < now) {
      store.delete(key);
    }
  }
}

// 每小时清理一次过期记录
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredRecords, 3600000);
}

/**
 * 限流规则预设
 */
export const RATE_LIMITS = {
  login: { limit: 5, window: 900000 },      // 15分钟 5次
  api: { limit: 100, window: 60000 },       // 1分钟 100次
  upload: { limit: 10, window: 3600000 },   // 1小时 10次
  strict: { limit: 10, window: 60000 },     // 1分钟 10次（敏感操作）
};
