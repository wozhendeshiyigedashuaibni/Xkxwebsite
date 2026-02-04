# 🚀 快速启动指南

5 分钟快速启动后台管理 API 服务。

---

## 步骤 1：安装依赖

```bash
cd server
npm install
```

---

## 步骤 2：配置环境变量

在项目**根目录**（不是 server 目录）创建 `.env` 文件：

```env
# 数据库（从 Supabase 获取）
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]/postgres"

# JWT 密钥（随机生成）
JWT_SECRET="your_random_secret_key_here_change_this_in_production"

# 服务器配置
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

💡 **提示**：如果已经有 `.env` 文件，只需确保包含以上配置。

---

## 步骤 3：初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 同步数据库结构
npx prisma db push
```

✅ **成功标志**：看到 "Your database is now in sync with your schema."

---

## 步骤 4：创建管理员账号

启动服务器：

```bash
npm run server
```

在另一个终端执行：

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

✅ **成功标志**：返回 `{"message":"Admin created successfully","id":1}`

---

## 步骤 5：测试登录

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

✅ **成功标志**：返回包含 `token` 的 JSON

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

**保存这个 token**，后续所有管理操作都需要它！

---

## 步骤 6：初始化网站内容（可选）

```bash
node server/seed-content.js
```

这将创建默认的网站内容结构（首页、关于我们等页面文案）。

✅ **成功标志**：看到 "✅ 完成！成功: XX"

---

## 步骤 7：运行自动化测试

### 测试产品 API

```bash
node server/test-admin-api.js
```

### 测试内容 API

```bash
node server/test-content-api.js
```

✅ **成功标志**：所有测试显示绿色的 ✓

---

## 🎉 完成！

现在你可以：

### 1️⃣ 使用 API

所有管理接口都需要在 Header 中携带 Token：

```bash
curl -X GET http://localhost:3001/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2️⃣ 查看文档

- **[产品 API 文档](./API_TEST.md)**
- **[内容 API 文档](./CONTENT_API_TEST.md)**

### 3️⃣ 可视化管理数据库

```bash
npx prisma studio
```

访问 http://localhost:5555

---

## 📋 常用命令速查

| 命令 | 说明 |
|------|------|
| `npm run server` | 启动后端服务器 |
| `npx prisma studio` | 打开数据库可视化工具 |
| `npx prisma db push` | 同步数据库结构 |
| `node server/seed-content.js` | 初始化网站内容 |
| `node server/test-admin-api.js` | 测试产品 API |
| `node server/test-content-api.js` | 测试内容 API |

---

## 🐛 遇到问题？

### 问题 1：数据库连接失败

```
❌ Database connection failed
```

**解决方法**：
1. 检查 `.env` 文件中的 `DATABASE_URL` 是否正确
2. 确保 Supabase 数据库可访问
3. 运行 `npx prisma db push` 确保表已创建

---

### 问题 2：Prisma Client 未生成

```
Error: @prisma/client did not initialize yet
```

**解决方法**：

```bash
npx prisma generate
```

---

### 问题 3：端口 3001 已被占用

```
Error: listen EADDRINUSE: address already in use :::3001
```

**解决方法**：
1. 关闭占用端口的进程
2. 或修改 `.env` 中的 `PORT` 为其他值

---

### 问题 4：登录失败

```
✗ 登录失败: Invalid credentials
```

**解决方法**：
1. 确保已执行步骤 4 创建管理员账号
2. 检查用户名和密码是否正确
3. 使用 `npx prisma studio` 查看 Admin 表确认账号存在

---

## 📖 下一步

1. **开发前端管理界面**
   - 使用 React + TypeScript
   - 参考 `/src/contexts/AdminAuthContext.tsx`

2. **部署到生产环境**
   - 参考 [README.md](./README.md) 的部署章节
   - 配置生产环境的环境变量

3. **添加更多功能**
   - 图片上传
   - 多语言支持
   - 数据统计

---

## ✅ 检查清单

- [ ] 安装依赖完成
- [ ] `.env` 文件已配置
- [ ] 数据库初始化完成
- [ ] 管理员账号已创建
- [ ] 登录测试成功
- [ ] 获取到有效的 Token
- [ ] 自动化测试通过

---

**所需时间**：约 5 分钟  
**难度**：⭐⭐☆☆☆（简单）  
**更新日期**：2026-02-04
