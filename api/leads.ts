/**
 * 询盘/联系表单接口
 * POST /api/leads
 *
 * 请求体:
 *   - name: 姓名 (必填)
 *   - email: 邮箱 (必填)
 *   - company: 公司名称 (可选)
 *   - phone: 电话 (可选)
 *   - whatsapp: WhatsApp 号码 (可选)
 *   - message: 留言内容 (必填)
 *   - files: 附件 URL 数组 (可选)
 *
 * 包含速率限制: 每分钟每 IP 最多 5 次，每邮箱每小时最多 10 次
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';
import { checkRateLimit, getClientIP } from '../lib/rateLimit';
import { json, error, serverError, tooManyRequests } from '../lib/response';

// 邮箱格式验证
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 简单的 XSS 清理
function sanitize(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { name, email, company, phone, whatsapp, message, files } = req.body || {};

    // 基本验证
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return error(res, '请输入有效的姓名（至少2个字符）');
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return error(res, '请输入有效的邮箱地址');
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return error(res, '请输入留言内容（至少10个字符）');
    }

    // IP 速率限制: 每分钟 5 次
    const clientIP = getClientIP(req);
    const ipLimit = checkRateLimit(`lead:ip:${clientIP}`, {
      windowMs: 60 * 1000,
      maxRequests: 5,
    });

    if (!ipLimit.allowed) {
      return tooManyRequests(res, '提交过于频繁，请1分钟后再试');
    }

    // 邮箱速率限制: 每小时 10 次
    const emailNormalized = email.toLowerCase().trim();
    const emailLimit = checkRateLimit(`lead:email:${emailNormalized}`, {
      windowMs: 60 * 60 * 1000,
      maxRequests: 10,
    });

    if (!emailLimit.allowed) {
      return tooManyRequests(res, '该邮箱提交次数过多，请1小时后再试');
    }

    // 清理输入
    const sanitizedData = {
      name: sanitize(name.trim()),
      email: emailNormalized,
      company: company ? sanitize(String(company).trim()) : null,
      phone: phone ? sanitize(String(phone).trim()) : null,
      whatsapp: whatsapp ? sanitize(String(whatsapp).trim()) : null,
      message: sanitize(message.trim()),
      files: files && Array.isArray(files) ? JSON.stringify(files) : null,
      status: 'new',
    };

    // 保存到数据库
    const lead = await prisma.lead.create({
      data: sanitizedData,
    });

    return json(res, {
      success: true,
      message: '询盘已提交成功，我们会尽快与您联系',
      id: lead.id,
    }, 201);
  } catch (err) {
    console.error('创建询盘失败:', err);
    return serverError(res, '提交失败，请稍后重试');
  }
}
