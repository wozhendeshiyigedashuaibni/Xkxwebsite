/**
 * 管理后台 - 内容管理接口
 *
 * GET /api/admin/content - 获取所有内容
 * PUT /api/admin/content - 更新指定 key 的内容
 * POST /api/admin/content - 创建新内容
 * DELETE /api/admin/content?key=xxx - 删除指定 key 的内容
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../lib/prisma';
import { formatContent } from '../lib/formatters';
import { authenticateRequest } from '../lib/auth';
import { json, error, notFound, serverError, unauthorized } from '../lib/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 验证认证
  const auth = await authenticateRequest(req);
  if (!auth.authenticated) {
    return unauthorized(res, auth.error);
  }

  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).json({ error: '方法不允许' });
  }
}

// 获取所有内容
async function handleGet(req: VercelRequest, res: VercelResponse) {
  try {
    const contents = await prisma.content.findMany({
      orderBy: { key: 'asc' },
    });

    return json(res, contents.map(formatContent));
  } catch (err) {
    console.error('获取内容列表失败:', err);
    return serverError(res, '获取内容列表失败');
  }
}

// 更新内容
async function handlePut(req: VercelRequest, res: VercelResponse) {
  try {
    const { key, value } = req.body || {};

    if (!key || typeof key !== 'string') {
      return error(res, '请提供有效的 key');
    }

    if (value === undefined) {
      return error(res, '请提供 value');
    }

    // 检查是否存在
    const existing = await prisma.content.findUnique({
      where: { key },
    });

    if (!existing) {
      return notFound(res, '未找到该内容');
    }

    const content = await prisma.content.update({
      where: { key },
      data: {
        value: typeof value === 'string' ? value : JSON.stringify(value),
      },
    });

    return json(res, formatContent(content));
  } catch (err) {
    console.error('更新内容失败:', err);
    return serverError(res, '更新内容失败');
  }
}

// 创建内容
async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const { key, value } = req.body || {};

    if (!key || typeof key !== 'string') {
      return error(res, '请提供有效的 key');
    }

    if (value === undefined) {
      return error(res, '请提供 value');
    }

    // 检查是否已存在
    const existing = await prisma.content.findUnique({
      where: { key },
    });

    if (existing) {
      return error(res, '该 key 已存在');
    }

    const content = await prisma.content.create({
      data: {
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
      },
    });

    return json(res, formatContent(content), 201);
  } catch (err) {
    console.error('创建内容失败:', err);
    return serverError(res, '创建内容失败');
  }
}

// 删除内容
async function handleDelete(req: VercelRequest, res: VercelResponse) {
  try {
    const { key } = req.query;

    if (!key || typeof key !== 'string') {
      return error(res, '请提供有效的 key');
    }

    // 检查是否存在
    const existing = await prisma.content.findUnique({
      where: { key },
    });

    if (!existing) {
      return notFound(res, '未找到该内容');
    }

    await prisma.content.delete({
      where: { key },
    });

    return json(res, { message: '删除成功', key });
  } catch (err) {
    console.error('删除内容失败:', err);
    return serverError(res, '删除内容失败');
  }
}
