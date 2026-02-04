# 后端连接配置指南

## 🎯 快速开始

### 1️⃣ 配置环境变量

已创建 `.env.local` 文件，内容如下：

```bash
# 关闭 Mock 模式，使用真实后端
VITE_USE_MOCK=false

# 后端 API 地址
VITE_API_URL=http://localhost:3001/api
```

### 2️⃣ 启动后端服务器

**方法 1：单独启动后端（推荐用于开发调试）**

在项目根目录打开新终端：

```bash
npm run server
```

你应该看到：

```
✅ Database connected successfully
🚀 Server running on http://localhost:3001
📊 Environment: development
🔗 Frontend URL: http://localhost:5173
```

**方法 2：同时启动前后端**

在项目根目录运行：

```bash
npm start
```

这会同时启动：
- 前端开发服务器（http://localhost:5173）
- 后端 API 服务器（http://localhost:3001）

### 3️⃣ 刷新浏览器

1. **停止当前的前端开发服务器**（Ctrl+C）
2. **重新启动前端**：
   ```bash
   npm run dev
   ```
3. **打开浏览器**：http://localhost:5173
4. **检查横幅消失**：顶部黄色的 "Development Mode" 横幅应该消失

---

## ✅ 验证连接

### 检查 1：浏览器控制台

打开浏览器控制台（F12），应该**不再看到**：

```
Using mock data (VITE_USE_MOCK=true)
```

### 检查 2：API 健康检查

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

### 检查 3：测试产品 API

在浏览器控制台运行：

```javascript
fetch('http://localhost:3001/api/products')
  .then(r => r.json())
  .then(console.log)
```

应该返回真实的产品数据（而不是 mock 数据）。

---

## 🔧 常见问题

### ❌ 问题 1：后端无法启动

**错误**：
```
❌ Database connection failed
```

**解决**：
1. 检查根目录是否有 `.env` 文件
2. 检查 `DATABASE_URL` 配置是否正确
3. 运行数据库迁移：
   ```bash
   npm run db:migrate
   ```

### ❌ 问题 2：CORS 错误

**错误**：
```
Access to fetch at 'http://localhost:3001/api/products' has been blocked by CORS policy
```

**解决**：
1. 确认后端已启动
2. 检查后端 `server/index.js` 中的 CORS 配置：
   ```javascript
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true,
   }));
   ```

### ❌ 问题 3：横幅仍然显示

**解决**：
1. 确认 `.env.local` 文件在项目根目录
2. 确认文件内容为 `VITE_USE_MOCK=false`
3. **完全停止前端服务器**（Ctrl+C）
4. **重新启动**：`npm run dev`
5. **硬刷新浏览器**：Ctrl+Shift+R

### ❌ 问题 4：环境变量未生效

Vite 环境变量只在**启动时**读取，修改后必须：

1. **停止服务器**
2. **重新启动**
3. **清除浏览器缓存**

---

## 📊 数据库准备

### 初始化数据库

如果数据库是空的，需要：

1. **运行迁移**：
   ```bash
   npm run db:migrate
   ```

2. **填充示例数据**：
   ```bash
   npm run db:seed
   ```

### 查看数据库

使用 Prisma Studio：

```bash
npm run db:studio
```

在浏览器打开 http://localhost:5555 查看数据库内容。

---

## 🚀 开发工作流

### 推荐的开发流程

**终端 1：后端服务器**
```bash
npm run server
```

**终端 2：前端开发服务器**
```bash
npm run dev
```

这样可以：
- ✅ 分别查看前后端日志
- ✅ 独立重启前端或后端
- ✅ 更容易调试问题

### 一键启动（仅用于快速测试）

```bash
npm start
```

注意：这会在同一个终端混合显示前后端日志，不便于调试。

---

## 🔄 切换回 Mock 模式

如果需要切换回 Mock 数据模式：

1. 编辑 `.env.local`：
   ```bash
   VITE_USE_MOCK=true
   ```

2. 重启前端：
   ```bash
   # Ctrl+C 停止
   npm run dev
   ```

3. 刷新浏览器，黄色横幅应该重新出现。

---

## 📁 文件说明

| 文件 | 用途 |
|------|------|
| `.env.local` | 本地开发环境变量（不提交到 Git） |
| `.env.example` | 环境变量模板（供其他开发者参考） |
| `.gitignore` | 防止敏感文件提交到 Git |

---

## 📝 环境变量说明

### VITE_USE_MOCK

**作用**：控制是否使用 Mock 数据

**值**：
- `false` - 连接真实后端 API
- `true` 或未设置 - 使用 Mock 数据

**位置**：`.env.local`

### VITE_API_URL

**作用**：后端 API 地址

**开发环境**：`http://localhost:3001/api`

**生产环境**：你的生产服务器地址（例如：`https://api.yourdomain.com/api`）

**位置**：`.env.local`

---

## ✅ 检查清单

启动真实后端前，确认：

- [ ] `.env.local` 文件已创建
- [ ] `VITE_USE_MOCK=false` 已设置
- [ ] `VITE_API_URL=http://localhost:3001/api` 已设置
- [ ] 后端服务器已启动（`npm run server`）
- [ ] 数据库已迁移（`npm run db:migrate`）
- [ ] 数据库已填充数据（`npm run db:seed`）
- [ ] 前端服务器已重启（`npm run dev`）
- [ ] 浏览器已硬刷新（Ctrl+Shift+R）

---

## 🎉 成功标志

当一切正常时，你应该看到：

1. ✅ **后端终端**：
   ```
   ✅ Database connected successfully
   🚀 Server running on http://localhost:3001
   ```

2. ✅ **前端浏览器**：
   - 黄色 "Development Mode" 横幅消失
   - 页面正常显示
   - 控制台无错误

3. ✅ **控制台日志**（打开 F12）：
   - 无 "Using mock data" 信息
   - API 请求指向 `http://localhost:3001/api/...`

---

## 🆘 需要帮助？

如果遇到问题：

1. **检查后端日志**（运行 `npm run server` 的终端）
2. **检查前端控制台**（浏览器 F12）
3. **测试健康检查**：访问 http://localhost:3001/api/health
4. **查看数据库**：运行 `npm run db:studio`

提供错误信息可以更快解决问题！
