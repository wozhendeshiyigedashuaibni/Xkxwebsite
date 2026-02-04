#!/usr/bin/env node

/**
 * Supabase 数据库连接检查脚本
 * 
 * 用途：验证 .env 配置是否正确，测试数据库连接
 * 运行：node check-supabase.js
 */

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// 加载环境变量
dotenv.config();

const requiredEnvVars = [
  'DATABASE_URL',
  'DIRECT_URL',
  'JWT_SECRET',
];

console.log('🔍 检查 Supabase 数据库配置...\n');

// 1. 检查环境变量
console.log('📋 第一步：检查环境变量');
console.log('─'.repeat(50));

let hasErrors = false;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: 未配置`);
    hasErrors = true;
  } else {
    // 隐藏敏感信息
    if (varName.includes('URL')) {
      const masked = value.replace(/:[^@]+@/, ':***@');
      console.log(`✅ ${varName}: ${masked}`);
    } else {
      console.log(`✅ ${varName}: 已配置`);
    }
  }
});

console.log('');

if (hasErrors) {
  console.log('❌ 配置检查失败！');
  console.log('💡 请检查根目录的 .env 文件');
  console.log('💡 参考 .env.example 文件配置正确的环境变量\n');
  process.exit(1);
}

// 2. 验证 DATABASE_URL 格式
console.log('📋 第二步：验证连接字符串格式');
console.log('─'.repeat(50));

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

// 检查 DATABASE_URL 端口
if (databaseUrl.includes(':5432/')) {
  console.log('✅ DATABASE_URL 使用正确端口 (5432)');
} else {
  console.log('⚠️  DATABASE_URL 应使用端口 5432 (Session mode)');
  hasErrors = true;
}

// 检查 DIRECT_URL 端口
if (directUrl.includes(':6543/')) {
  console.log('✅ DIRECT_URL 使用正确端口 (6543)');
} else {
  console.log('⚠️  DIRECT_URL 应使用端口 6543 (Transaction mode)');
  hasErrors = true;
}

// 检查是否包含 Supabase 域名
if (databaseUrl.includes('supabase.com')) {
  console.log('✅ 检测到 Supabase 数据库连接');
} else {
  console.log('⚠️  未检测到 Supabase 域名，请确认连接字符串');
}

console.log('');

if (hasErrors) {
  console.log('❌ 连接字符串格式检查失败！');
  console.log('💡 请参考 SUPABASE_CONFIG.md 中的配置说明\n');
  process.exit(1);
}

// 3. 测试数据库连接
console.log('📋 第三步：测试数据库连接');
console.log('─'.repeat(50));

const prisma = new PrismaClient({
  log: ['error'],
});

async function testConnection() {
  try {
    console.log('🔌 正在连接到 Supabase 数据库...');
    
    // 测试连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功！');
    
    // 执行简单查询
    console.log('🔍 执行测试查询...');
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ 查询执行成功！');
    
    // 检查表是否存在
    console.log('🔍 检查数据表...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    if (tables.length === 0) {
      console.log('⚠️  数据库为空，尚未运行迁移');
      console.log('💡 请运行: npx prisma db push');
    } else {
      console.log('✅ 找到以下数据表:');
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
      
      // 检查必需的表
      const tableNames = tables.map(t => t.table_name);
      const requiredTables = ['Admin', 'Product', 'Content', 'Lead'];
      const missingTables = requiredTables.filter(t => !tableNames.includes(t));
      
      if (missingTables.length > 0) {
        console.log('\n⚠️  缺少以下表:');
        missingTables.forEach(table => {
          console.log(`   - ${table}`);
        });
        console.log('💡 请运行: npx prisma db push');
      } else {
        console.log('\n✅ 所有必需的表都已创建！');
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Supabase 配置检查完成！');
    console.log('='.repeat(50));
    console.log('\n✅ 数据库已准备就绪，可以启动服务器：');
    console.log('   cd server && npm run dev\n');
    
  } catch (error) {
    console.log('❌ 数据库连接失败！\n');
    console.log('错误详情:');
    console.log(error.message);
    console.log('\n常见问题排查:');
    console.log('1. 检查 .env 文件中的 DATABASE_URL 和 DIRECT_URL');
    console.log('2. 确认数据库密码正确（特殊字符需要 URL 编码）');
    console.log('3. 确认 Supabase 项目状态为 Active（非 Paused）');
    console.log('4. 检查网络连接和防火墙设置');
    console.log('\n💡 详细配置指南: 查看 SUPABASE_CONFIG.md\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
