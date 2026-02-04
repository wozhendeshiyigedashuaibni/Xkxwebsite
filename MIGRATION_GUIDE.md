# 数据库迁移指南：SQLite → Supabase Postgres

## 📋 前置准备

### 1. 获取 Supabase 数据库连接字符串

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Project Settings** > **Database** > **Connection String**
4. 复制两个连接字符串：
   - **Session mode (Port 5432)** → 用于 `DATABASE_URL`
   - **Transaction mode (Port 6543)** → 用于 `DIRECT_URL`

### 2. 配置环境变量

创建或更新 `.env` 文件（**不要提交到 Git**）：

```bash
# 复制示例文件
cp .env.example .env

# 编辑 .env 文件，替换以下内容：
# - [PROJECT-REF]: 你的 Supabase 项目引用 ID
# - [YOUR-PASSWORD]: 你的数据库密码
# - [REGION]: 你的 Supabase 区域（如 ap-southeast-1）
```

示例配置：
```env
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:MySecurePassword123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.abcdefghijklmnop:MySecurePassword123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 迁移步骤

### 方案 A：初次迁移（推荐）

使用 `prisma db push` 快速同步 schema 到 Supabase：

```bash
# 1. 生成 Prisma Client（基于新的 PostgreSQL provider）
npx prisma generate

# 2. 将 schema 推送到 Supabase 数据库
npx prisma db push

# 3. 查看数据库结构（可选）
npx prisma studio
```

**优点**：
- ✅ 快速，无需创建迁移文件
- ✅ 适合开发环境和原型项目
- ✅ 自动处理 schema 差异

---

### 方案 B：使用迁移记录（生产环境推荐）

如果需要完整的迁移历史记录：

```bash
# 1. 生成 Prisma Client
npx prisma generate

# 2. 创建初始迁移（会生成 SQL 文件）
npx prisma migrate dev --name init

# 3. 查看数据库结构（可选）
npx prisma studio
```

**优点**：
- ✅ 保留完整迁移历史
- ✅ 适合团队协作
- ✅ 便于回滚和审计

**注意**：如果已有旧的 SQLite 迁移文件（`prisma/migrations/`），建议：
```bash
# 删除旧的 SQLite 迁移记录
rm -rf prisma/migrations

# 然后重新创建 PostgreSQL 迁移
npx prisma migrate dev --name init
```

---

## 🌱 填充初始数据（可选）

如果需要创建初始管理员账号或示例数据：

```bash
# 创建 seed 脚本（prisma/seed.ts 或 seed.js）
# 然后运行：
npx prisma db seed
```

---

## ✅ 验证迁移

### 1. 检查表是否创建成功

```bash
npx prisma studio
```

应该看到以下表：
- ✅ Admin
- ✅ Product
- ✅ Content
- ✅ Lead

### 2. 在 Supabase Dashboard 中验证

1. 进入 **Table Editor**
2. 确认所有表已创建
3. 检查字段类型和约束

---

## 🔧 常见问题

### Q1: 提示 "Can't reach database server"
**解决方案**：
- 检查 `.env` 中的连接字符串是否正确
- 确认 Supabase 项目状态为 "Active"
- 检查网络连接和防火墙设置

### Q2: 提示 "relation already exists"
**解决方案**：
```bash
# 重置数据库（⚠️ 会删除所有数据）
npx prisma migrate reset

# 或手动在 Supabase Dashboard 删除所有表后重新运行
npx prisma db push
```

### Q3: Prisma Client 报错
**解决方案**：
```bash
# 重新生成 Prisma Client
npx prisma generate

# 重启开发服务器
npm run dev
```

---

## 📊 后续开发

迁移完成后，每次修改 schema 时：

```bash
# 开发环境（推荐）
npx prisma db push

# 或创建新迁移（生产环境）
npx prisma migrate dev --name describe_your_change
```

---

## ⚠️ 重要提醒

1. **不要提交 `.env` 文件**到 Git（已在 `.gitignore` 中）
2. **DATABASE_URL** 和 **DIRECT_URL** 必须使用不同的端口（5432 vs 6543）
3. 生产环境部署时，记得在 Supabase Dashboard 设置环境变量
4. 定期备份数据库（Supabase 提供自动备份功能）

---

## 🎉 完成

数据库迁移完成！现在可以继续开发后台管理系统的 API 了。
