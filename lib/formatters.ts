/**
 * 数据格式化工具
 */

import type { Product, Lead, Content } from '@prisma/client';

/**
 * 解析 Product 的 JSON 字段
 */
export function formatProduct(product: Product) {
  return {
    ...product,
    images: safeJsonParse(product.images, []),
    customOptions: safeJsonParse(product.customOptions, []),
    tags: safeJsonParse(product.tags, []),
  };
}

/**
 * 解析 Lead 的 JSON 字段
 */
export function formatLead(lead: Lead) {
  return {
    ...lead,
    files: safeJsonParse(lead.files, []),
  };
}

/**
 * 解析 Content 的 JSON 字段
 */
export function formatContent(content: Content) {
  return {
    ...content,
    value: safeJsonParse(content.value, content.value),
  };
}

/**
 * 安全的 JSON 解析
 */
function safeJsonParse<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
