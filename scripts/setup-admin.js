/**
 * 管理员账户设置脚本
 *
 * 使用方法:
 *   node scripts/setup-admin.js [email] [password]
 *
 * 示例:
 *   node scripts/setup-admin.js admin@example.com MySecurePass123
 *
 * 如果管理员已存在，将更新密码
 * 如果不存在，将创建新管理员
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// 邮箱格式验证
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function setupAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('使用方法: node scripts/setup-admin.js [email] [password]');
    console.log('示例: node scripts/setup-admin.js admin@example.com MySecurePass123');
    process.exit(1);
  }

  const [email, password] = args;

  // 验证邮箱格式
  if (!isValidEmail(email)) {
    console.error('错误: 请输入有效的邮箱地址');
    process.exit(1);
  }

  // 验证密码强度
  if (password.length < 8) {
    console.error('错误: 密码长度至少8位');
    process.exit(1);
  }

  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    console.error('错误: 密码必须包含字母和数字');
    process.exit(1);
  }

  const weakPasswords = ['password', 'admin123', '12345678', 'password123', 'admin888'];
  if (weakPasswords.includes(password.toLowerCase())) {
    console.error('错误: 密码过于简单，请使用更复杂的密码');
    process.exit(1);
  }

  try {
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailNormalized = email.toLowerCase().trim();

    // 查找现有管理员
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: emailNormalized },
    });

    if (existingAdmin) {
      // 更新密码
      await prisma.admin.update({
        where: { email: emailNormalized },
        data: { password: hashedPassword },
      });
      console.log(`管理员 "${emailNormalized}" 密码已更新`);
    } else {
      // 创建新管理员
      await prisma.admin.create({
        data: {
          email: emailNormalized,
          password: hashedPassword,
        },
      });
      console.log(`管理员 "${emailNormalized}" 已创建`);
    }

    console.log('设置完成！');
  } catch (error) {
    console.error('设置失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin();
