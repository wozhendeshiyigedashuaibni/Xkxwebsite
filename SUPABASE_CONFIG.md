# 🚀 Supabase Postgres 数据库配置指南

> **当前项目**: 西凯溪 B2B 女装 OEM/ODM 后台管理系统  
> **Prisma 版本**: 7.x (新配置格式)  
> **数据库**: Supabase PostgreSQL

---

## 📋 第一步：获取 Supabase 数据库连接信息

### 1.1 登录 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目（如果没有项目，点击 "New Project" 创建）

**当前项目 ID**: `zmkxsesiefrefwhjkhhk`

### 1.2 获取数据库连接字符串

进入项目后，按照以下路径操作：

```
Project Settings (左侧齿轮⚙️图标) 
  → Database (左侧菜单)
  → Connection String (页面中部)
```

你会看到两个连接字符串模式：

#### ✅ URI (推荐) - 复制以下两个连接字符串

**1. Session mode (Pooler - Port 5432)**  
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```
→ 用于应用程序连接池，性能更好  
→ 配置到 `DATABASE_URL`

**2. Transaction mode (Direct - Port 6543)**  
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```
→ 用于数据库迁移和直连  
→ 配置到 `DIRECT_URL`

### 1.3 参数说明

替换以下占位符：

| 占位符 | 说明 | 示例 |
|--------|------|------|
| `[PROJECT-REF]` | Supabase 项目引用 ID | `zmkxsesiefrefwhjkhhk` |
| `[YOUR-PASSWORD]` | 数据库密码（创建项目时设置） | `MyPassword123!` |
| `[REGION]` | 数据库区域 | `ap-southeast-1` (新加坡) |

### 1.4 查找数据库密码

如果忘记密码：

1. 进入 **Project Settings** > **Database** > **Database Password**
2. 点击 **Reset Database Password**
3. 生成新密码并妥善保存（⚠️ 密码只显示一次）

---

## 🔧 第二步：配置项目环境变量

### 2.1 创建 `.env` 文件

在**项目根目录**创建 `.env` 文件（已在 `.gitignore` 中，不会提交到 Git）：

```bash
cp .env.example .env
```

### 2.2 编辑 `.env` 文件

打开 `.env` 文件，填入你的真实连接信息：

```env
# ===========================================
# 数据库配置 (Supabase Postgres)
# ===========================================

# Session Mode - 用于应用程序连接
DATABASE_URL="postgresql://postgres.zmkxsesiefrefwhjkhhk:YourActualPassword@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Transaction Mode - 用于数据库迁移
DIRECT_URL="postgresql://postgres.zmkxsesiefrefwhjkhhk:YourActualPassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# JWT 密钥 (自定义一个强密码)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 后端服务器配置
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

⚠️ **重要提醒**:
- ✅ 确保 `DATABASE_URL` 使用端口 **5432**
- ✅ 确保 `DIRECT_URL` 使用端口 **6543**
- ✅ 密码中如果包含特殊字符（`@`, `:`, `/` 等），需要 URL 编码

### 2.3 密码 URL 编码（如果需要）

如果你的密码包含特殊字符，使用在线工具编码：
- 访问 [URL Encoder](https://www.urlencoder.org/)
- 或在 JavaScript 控制台运行: `encodeURIComponent('YourPassword@123')`

示例：
- 原密码: `MyPass@123!`
- 编码后: `MyPass%40123%21`

---

## 🗃️ 第三步：执行数据库迁移

### 3.1 验证 Prisma 配置

确认项目使用 Prisma 7.x 新格式配置：

**文件结构检查**:
```
项目根目录/
├── prisma.config.ts         ← 数据库连接配置
└── prisma/
    └── schema.prisma        ← 数据模型定义 (不含 url)
```

**验证 `prisma.config.ts`**:
```bash
cat prisma.config.ts
```

应该看到：
```typescript
import { defineConfig } from '@prisma/client/generator-build'

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || '',
      directUrl: process.env.DIRECT_URL || '',
    },
  },
})
```

**验证 `prisma/schema.prisma`**:
```bash
head -10 prisma/schema.prisma
```

应该看到：
```prisma
datasource db {
  provider  = "postgresql"
  // ✅ 不包含 url 和 directUrl
}
```

### 3.2 安装/更新依赖

如果 server 目录的 Prisma 还是 6.x 版本，先更新：

```bash
cd server
npm install @prisma/client@latest prisma@latest
cd ..
```

### 3.3 生成 Prisma Client

```bash
npx prisma generate
```

**预期输出**:
```
✔ Generated Prisma Client to ./node_modules/@prisma/client
```

### 3.4 推送数据库 Schema（方案 A - 推荐）

使用 `db push` 快速同步 schema 到 Supabase：

```bash
npx prisma db push
```

**预期输出**:
```
🚀  Your database is now in sync with your Prisma schema. Done in 2.3s

✔ Generated Prisma Client
```

### 3.5 （可选）使用迁移记录（方案 B）

如果需要完整的迁移历史记录（生产环境推荐）：

```bash
# 删除旧的 SQLite 迁移文件（如果有）
rm -rf prisma/migrations

# 创建初始 PostgreSQL 迁移
npx prisma migrate dev --name init
```

---

## ✅ 第四步：验证数据库连接

### 4.1 使用 Prisma Studio 检查

```bash
npx prisma studio
```

浏览器会自动打开 `http://localhost:5555`，检查以下表是否创建：

- ✅ `Admin` - 管理员表
- ✅ `Product` - 产品表
- ✅ `Content` - 内容表
- ✅ `Lead` - 询盘线索表

### 4.2 在 Supabase Dashboard 中验证

1. 进入 Supabase Dashboard > **Table Editor**
2. 确认所有表已显示
3. 检查表结构和字段类型

### 4.3 测试后端服务器连接

```bash
# 启动后端服务器
cd server
npm run dev
```

**预期输出**:
```
✅ Database connected successfully
🚀 Server running on http://localhost:3001
```

在浏览器访问：
```
http://localhost:3001/api/health
```

应该返回：
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-02-04T..."
}
```

---

## 🌱 第五步：填充初始数据（可选）

### 5.1 创建初始管理员账号

运行种子脚本：

```bash
cd server
node seed.js
```

**默认管理员账号**:
- 用户名: `admin`
- 密码: `admin123`

⚠️ **生产环境务必修改此密码！**

### 5.2 手动创建管理员（可选）

使用 Prisma Studio：

```bash
npx prisma studio
```

进入 `Admin` 表，添加新记录：
- `username`: 你的用户名
- `password`: 使用 bcrypt 加密后的密码（可通过 seed.js 脚本生成）

---

## 🔍 第六步：故障排查

### 问题 1: "Can't reach database server"

**可能原因**:
- ❌ 连接字符串错误
- ❌ 密码错误或未 URL 编码
- ❌ Supabase 项目未激活
- ❌ 网络/防火墙问题

**解决方案**:
```bash
# 1. 检查 .env 文件
cat .env | grep DATABASE_URL

# 2. 测试连接
npx prisma db push

# 3. 查看详细错误
npx prisma db push --print
```

### 问题 2: "P1001: Can't reach database"

**解决方案**:
- 确认 Supabase 项目状态为 "Active"（不是 Paused）
- 检查你的 IP 是否在 Supabase 允许列表中
- 尝试重新生成数据库密码

### 问题 3: "relation already exists"

**解决方案**:

```bash
# 方法 1: 使用 Prisma 重置（会删除所有数据）
npx prisma migrate reset

# 方法 2: 手动在 Supabase Dashboard 删除所有表
# 然后重新推送
npx prisma db push
```

### 问题 4: Prisma Client 版本不匹配

**解决方案**:
```bash
# 确保主项目和 server 目录都更新
npm install @prisma/client@latest prisma@latest
cd server && npm install @prisma/client@latest prisma@latest

# 重新生成 Client
cd .. && npx prisma generate
```

### 问题 5: 环境变量未加载

**解决方案**:

检查 `server/index.js` 是否包含：
```javascript
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // 加载根目录的 .env
```

---

## 🔄 第七步：连接前端到后端

### 7.1 配置前端环境变量

创建 `.env.local` 文件（在项目根目录）：

```env
# 关闭 Mock 模式，使用真实后端
VITE_USE_MOCK=false

# 后端 API 地址
VITE_API_BASE_URL=http://localhost:3001/api
```

### 7.2 启动完整应用

**Terminal 1 - 启动后端**:
```bash
cd server
npm run dev
```

**Terminal 2 - 启动前端**:
```bash
npm run dev
```

### 7.3 验证连接

访问前端页面：
```
http://localhost:5173
```

打开浏览器控制台，检查网络请求：
- ✅ API 请求地址应为 `http://localhost:3001/api/...`
- ✅ 返回状态应为 `200 OK`
- ✅ 无 CORS 错误

---

## 📊 日常开发工作流

### Schema 更新流程

当你修改 `prisma/schema.prisma` 后：

```bash
# 1. 推送更改到数据库（开发环境推荐）
npx prisma db push

# 2. 重新生成 Prisma Client
npx prisma generate

# 3. 重启后端服务器
cd server && npm run dev
```

### 查看数据库数据

```bash
# 方法 1: Prisma Studio (推荐)
npx prisma studio

# 方法 2: Supabase Dashboard
# 访问 Table Editor 直接查看
```

---

## 🛡️ 安全提醒

### ⚠️ 必须注意的安全事项

1. **不要提交 `.env` 文件**
   - ✅ 已在 `.gitignore` 中
   - ❌ 绝不提交包含真实密码的文件

2. **生产环境配置**
   - 修改默认管理员密码
   - 使用强 JWT_SECRET（至少 32 字符随机字符串）
   - 启用 Supabase Row Level Security (RLS)

3. **数据库凭证管理**
   - 使用环境变量存储敏感信息
   - 定期轮换数据库密码
   - 不在代码中硬编码密码

---

## 🎉 完成！

现在你已经成功将项目迁移到 Supabase Postgres 数据库！

### 后续步骤

1. ✅ 测试所有 API 端点
2. ✅ 验证前端与后端的数据交互
3. ✅ 配置生产环境部署（如 Vercel + Supabase）
4. ✅ 设置数据库备份策略

### 资源链接

- [Prisma 7.x 文档](https://www.prisma.io/docs/orm/overview/introduction)
- [Supabase 文档](https://supabase.com/docs)
- [项目 MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

**如有问题，请参考 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) 或联系开发团队。**
