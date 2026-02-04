# 🚀 Supabase 数据库快速配置（5分钟搞定）

> 本指南帮助你快速将项目连接到 Supabase Postgres 数据库

---

## ⚡ 快速步骤

### 1️⃣ 获取 Supabase 连接字符串（2分钟）

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目 → **Settings** ⚙️ → **Database** → **Connection String**
3. 复制以下两个字符串：

```
Session mode (Port 5432):
postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres

Transaction mode (Port 6543):  
postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**当前项目 REF**: `zmkxsesiefrefwhjkhhk`

---

### 2️⃣ 创建 .env 文件（1分钟）

在**项目根目录**创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env`，粘贴你的连接字符串：

```env
# 粘贴 Session mode 连接字符串（端口 5432）
DATABASE_URL="postgresql://postgres.zmkxsesiefrefwhjkhhk:你的密码@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# 粘贴 Transaction mode 连接字符串（端口 6543）
DIRECT_URL="postgresql://postgres.zmkxsesiefrefwhjkhhk:你的密码@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# 自定义一个强密码
JWT_SECRET="your-super-secret-jwt-key-change-this"

# 保持默认配置
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

⚠️ **注意**: 替换 `你的密码` 为你的实际数据库密码

---

### 3️⃣ 验证配置（1分钟）

运行检查脚本：

```bash
npm run db:check
```

**预期输出**:
```
✅ DATABASE_URL: postgresql://postgres.zmkxse***@...
✅ DIRECT_URL: postgresql://postgres.zmkxse***@...
✅ DATABASE_URL 使用正确端口 (5432)
✅ DIRECT_URL 使用正确端口 (6543)
🔌 正在连接到 Supabase 数据库...
✅ 数据库连接成功！
```

如果出错，查看错误提示并检查：
- 密码是否正确
- Supabase 项目是否为 Active 状态
- 网络连接是否正常

---

### 4️⃣ 创建数据表（1分钟）

```bash
# 方法 1: 快速推送（推荐开发环境）
npm run db:push

# 方法 2: 创建迁移记录（推荐生产环境）
npm run db:migrate
```

**预期输出**:
```
🚀 Your database is now in sync with your Prisma schema.
✔ Generated Prisma Client
```

---

### 5️⃣ （可选）创建初始数据

```bash
npm run db:seed
```

这将创建：
- 默认管理员账号（用户名: `admin`, 密码: `admin123`）
- 示例产品数据

---

### 6️⃣ 启动应用

**终端 1 - 启动后端**:
```bash
cd server
npm run dev
```

**终端 2 - 启动前端**:
```bash
npm run dev
```

---

## ✅ 验证成功

### 检查后端

访问: http://localhost:3001/api/health

应返回:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-02-04T..."
}
```

### 检查前端

1. 访问: http://localhost:5173
2. 打开浏览器控制台（F12）
3. 查看 Network 标签，API 请求应返回 200 OK

### 查看数据库

```bash
npm run db:studio
```

浏览器会自动打开 Prisma Studio（http://localhost:5555），可以查看和编辑数据。

---

## 🔧 常用命令

| 命令 | 说明 |
|------|------|
| `npm run db:check` | 检查数据库连接 |
| `npm run db:push` | 推送 schema 到数据库 |
| `npm run db:migrate` | 创建迁移记录 |
| `npm run db:generate` | 生成 Prisma Client |
| `npm run db:seed` | 填充初始数据 |
| `npm run db:studio` | 打开数据库管理界面 |

---

## 🆘 常见问题

### ❌ "Can't reach database server"

**原因**: 连接字符串错误或网络问题

**解决**:
1. 检查 `.env` 文件中的密码是否正确
2. 确认 Supabase 项目状态为 "Active"
3. 如果密码包含特殊字符，需要 URL 编码

### ❌ "Environment variable not found: DATABASE_URL"

**原因**: 环境变量未加载

**解决**:
```bash
# 确认 .env 文件在项目根目录
ls -la .env

# 检查文件内容
cat .env
```

### ❌ Prisma Client 报错

**解决**:
```bash
npm run db:generate
```

---

## 📚 更多信息

- **详细配置指南**: [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md)
- **迁移指南**: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- **后端设置**: [BACKEND_SETUP.md](./BACKEND_SETUP.md)

---

## 🎉 完成！

现在你的应用已经成功连接到 Supabase 数据库，可以开始开发了！

**下一步建议**:
1. 修改默认管理员密码
2. 测试 API 端点
3. 开发前端管理界面
4. 准备生产环境部署

有问题？查看 [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md) 获取详细帮助。
