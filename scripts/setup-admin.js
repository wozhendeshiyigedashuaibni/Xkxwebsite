/**
 * 管理员账户设置脚本
 *
 * 使用方法:
 *   node scripts/setup-admin.js [username] [password]
 *
 * 示例:
 *   node scripts/setup-admin.js admin MySecurePass123
 *
 * 如果管理员已存在，将更新密码
 * 如果不存在，将创建新管理员
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setupAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('使用方法: node scripts/setup-admin.js [username] [password]');
    console.log('示例: node scripts/setup-admin.js admin MySecurePass123');
    process.exit(1);
  }

  const [username, password] = args;

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

    // 查找现有管理员
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      // 更新密码
      await prisma.admin.update({
        where: { username },
        data: { password: hashedPassword },
      });
      console.log(`管理员 "${username}" 密码已更新`);
    } else {
      // 创建新管理员
      await prisma.admin.create({
        data: {
          username,
          password: hashedPassword,
        },
      });
      console.log(`管理员 "${username}" 已创建`);
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
