# 后台管理系统测试指南

## 🔍 问题排查

### 步骤 1：确认服务器运行

打开两个终端窗口：

**终端 1 - 后端服务器**
```bash
cd server
npm run server
```

✅ 应该看到：
```
Server is running on http://localhost:3001
Database connected
```

**终端 2 - 前端开发服务器**
```bash
npm run dev
```

✅ 应该看到：
```
VITE v6.x.x ready in xxx ms
Local: http://localhost:5173/
```

---

### 步骤 2：创建管理员账号

在新终端运行：

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

✅ 成功响应：
```json
{"message":"Admin created successfully","id":1}
```

❌ 如果报错 "Admin already exists"，说明账号已存在，可以直接登录。

---

### 步骤 3：测试后台登录

#### 方法 1：浏览器访问

1. 打开浏览器
2. 访问：`http://localhost:5173/admin-login`
3. 输入账号密码：
   - Username: `admin`
   - Password: `admin123`
4. 点击 "Sign in"

✅ **成功**：跳转到 `http://localhost:5173/admin/products`

❌ **失败**：检查浏览器控制台（F12）查看错误信息

---

#### 方法 2：从首页访问

1. 访问首页：`http://localhost:5173/`
2. 滚动到页脚底部
3. 在版权信息下方会看到一个小圆点 `•`（鼠标悬停会变亮）
4. 点击小圆点跳转到登录页

---

#### 方法 3：直接访问管理页面

1. 访问：`http://localhost:5173/admin/products`
2. 如果未登录，会自动跳转到登录页
3. 登录后会返回到产品管理页面

---

### 步骤 4：验证后台功能

#### 产品管理页面

访问：`http://localhost:5173/admin/products`

✅ 应该看到：
- 侧边栏导航
- 产品列表表格
- 搜索框和分类筛选
- 底部统计卡片

如果显示空列表，可以：
1. 使用 API 添加测试产品
2. 或参考 `/server/API_TEST.md` 创建产品

---

#### 内容管理页面

访问：`http://localhost:5173/admin/content`

✅ 应该看到：
- 侧边栏导航
- 按页面分组的内容列表
- 搜索框
- 编辑按钮

如果显示空列表，运行：
```bash
node server/seed-content.js
```

---

## 🐛 常见问题排查

### 问题 1：页面空白/无反应

**可能原因**：
- 前端编译错误
- JavaScript 错误

**解决方法**：
1. 打开浏览器控制台（F12）
2. 查看 Console 标签是否有错误
3. 查看 Network 标签是否有请求失败
4. 复制错误信息并提供给我

---

### 问题 2：登录后立即退出

**可能原因**：
- Token 存储失败
- AdminAuthContext 错误

**解决方法**：
1. 清除浏览器缓存和 LocalStorage
2. 打开浏览器控制台，检查 Application > Local Storage
3. 确认是否有 `admin-token` 键

---

### 问题 3：产品/内容列表为空

**可能原因**：
- 数据库没有数据
- API 调用失败

**解决方法**：

**初始化内容数据**：
```bash
node server/seed-content.js
```

**添加测试产品**：
```bash
curl -X POST http://localhost:3001/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Product",
    "description": "Test Description",
    "category": "Dresses",
    "mainImage": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
    "images": ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446"],
    "moq": "100 pieces",
    "featured": true,
    "active": true
  }'
```

---

### 问题 4：API 请求失败

**可能原因**：
- 后端服务器未运行
- 端口冲突
- CORS 错误

**解决方法**：

1. 确认后端运行在 3001 端口：
```bash
curl http://localhost:3001/api/products
```

2. 检查 CORS 配置：
后端应该允许 `http://localhost:5173` 的请求

3. 查看后端日志是否有错误

---

### 问题 5：路由 404 错误

**可能原因**：
- React Router 配置错误
- 路由未正确注册

**解决方法**：

检查 `/src/app/App.tsx` 是否包含以下路由：
```tsx
<Route path="/admin-login" element={<AdminLoginPage />} />
<Route path="/admin/products" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
<Route path="/admin/content" element={<ProtectedRoute><AdminContentPage /></ProtectedRoute>} />
```

---

## 🔧 调试工具

### 1. 浏览器开发者工具

**打开方式**：按 F12 或右键 > 检查

**主要标签**：
- **Console**：查看 JavaScript 错误和日志
- **Network**：查看 API 请求和响应
- **Application**：查看 LocalStorage、Cookies

---

### 2. React Developer Tools

安装 React DevTools 浏览器插件：
- Chrome: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- Firefox: [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

可以查看：
- 组件树结构
- Props 和 State
- Context 值（包括 AdminAuthContext）

---

### 3. 数据库管理

使用 Prisma Studio 查看数据库：

```bash
cd server
npx prisma studio
```

访问：`http://localhost:5555`

可以查看和编辑：
- Admin 表（管理员账号）
- Product 表（产品数据）
- Content 表（内容数据）

---

## 📋 完整检查清单

在报告问题前，请确认以下各项：

- [ ] 后端服务器正在运行（端口 3001）
- [ ] 前端开发服务器正在运行（端口 5173）
- [ ] 已创建管理员账号
- [ ] 浏览器控制台没有错误
- [ ] 已清除浏览器缓存
- [ ] 已初始化内容数据（运行 seed-content.js）
- [ ] API 请求成功（Network 标签检查）
- [ ] Token 已保存到 LocalStorage
- [ ] 路由配置正确

---

## 📸 需要提供的信息

如果问题仍未解决，请提供：

1. **浏览器控制台截图**（F12 > Console）
2. **Network 标签截图**（显示 API 请求）
3. **后端终端日志**
4. **前端终端日志**
5. **具体的操作步骤**
6. **预期行为 vs 实际行为**

---

## ✅ 成功标志

后台管理系统正常工作应该看到：

1. ✅ 登录页面显示正常
2. ✅ 输入账号密码后成功登录
3. ✅ 跳转到产品管理页面
4. ✅ 侧边栏显示正常
5. ✅ 可以在产品管理和内容管理之间切换
6. ✅ 产品列表显示（或显示空状态）
7. ✅ 内容列表显示（运行 seed 后）
8. ✅ 可以编辑和保存内容
9. ✅ 点击 Logout 可以退出

---

## 🚀 快速测试脚本

保存为 `test-admin.sh`：

```bash
#!/bin/bash

echo "🔍 Testing Admin System..."

# 1. 测试后端健康
echo "\n1️⃣ Testing backend health..."
curl -s http://localhost:3001/api/products > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ Backend is running"
else
  echo "❌ Backend is not running - start with: cd server && npm run server"
  exit 1
fi

# 2. 创建管理员（如果不存在）
echo "\n2️⃣ Creating admin account..."
curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | grep -q "successfully\|already"
if [ $? -eq 0 ]; then
  echo "✅ Admin account ready"
else
  echo "❌ Failed to create admin account"
fi

# 3. 测试登录
echo "\n3️⃣ Testing login..."
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Login successful"
  echo "Token: ${TOKEN:0:20}..."
else
  echo "❌ Login failed"
  exit 1
fi

# 4. 测试产品 API
echo "\n4️⃣ Testing products API..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/admin/products > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ Products API working"
else
  echo "❌ Products API failed"
fi

# 5. 测试内容 API
echo "\n5️⃣ Testing content API..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/admin/content > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ Content API working"
else
  echo "❌ Content API failed"
fi

echo "\n✅ All tests passed! Visit http://localhost:5173/admin-login"
```

运行：
```bash
chmod +x test-admin.sh
./test-admin.sh
```

---

**更新时间**：2026-02-04
