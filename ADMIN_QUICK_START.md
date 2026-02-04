# 🚀 后台管理系统 - 快速启动指南

## ✅ 系统已修复并就绪

所有已知问题已修复，后台管理系统现在可以正常使用！

---

## 📋 启动步骤（5分钟完成）

### 步骤 1：启动服务器

打开 **两个终端窗口**：

#### 终端 1 - 后端服务器
```bash
cd server
npm run server
```
✅ 应该看到：`Server is running on http://localhost:3001`

#### 终端 2 - 前端开发服务器
```bash
npm run dev
```
✅ 应该看到：`Local: http://localhost:5173/`

---

### 步骤 2：运行测试脚本（可选但推荐）

#### Linux/Mac：
```bash
chmod +x test-fix.sh
./test-fix.sh
```

#### Windows：
```bash
test-fix.bat
```

这个脚本会：
- ✅ 检查服务器运行状态
- ✅ 自动创建管理员账号
- ✅ 测试所有 API 接口
- ✅ 显示访问地址

---

### 步骤 3：访问后台

#### 方法 1：直接访问（推荐）
```
http://localhost:5173/admin-login
```

#### 方法 2：从首页进入
1. 访问：`http://localhost:5173/`
2. 滚动到页脚底部
3. 点击小圆点 `•` 进入登录页

#### 方法 3：测试页面
```
http://localhost:5173/admin-test.html
```
这是一个诊断页面，可以检测系统状态

---

### 步骤 4：登录

#### 默认账号
- **Username**: `admin`
- **Password**: `admin123`

#### 首次使用需要创建账号
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🎯 后台功能概览

登录后可以访问以下页面：

### 1. 简化版后台（推荐先测试）
```
http://localhost:5173/admin/dashboard
```
- 显示系统状态
- 快速导航到各个管理页面

### 2. 产品管理
```
http://localhost:5173/admin/products
```
- 查看所有产品
- 添加新产品
- 编辑产品信息
- 删除产品
- 按分类筛选

### 3. 内容管理
```
http://localhost:5173/admin/content
```
- 编辑首页内容
- 编辑各页面文案
- 修改 SEO 信息
- 更新联系信息

---

## 🛠️ 常用命令

### 创建管理员账号
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 初始化网站内容
```bash
node server/seed-content.js
```

### 添加测试产品
```bash
node server/seed.js
```

### 测试登录
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🐛 故障排查

### 问题 1：页面空白

**解决方法**：
1. 按 `F12` 打开浏览器控制台
2. 查看 Console 标签的错误
3. 按 `Ctrl + F5` 强制刷新
4. 清除浏览器缓存

### 问题 2：无法登录

**检查项**：
- ✅ 后端服务器是否运行（端口 3001）
- ✅ 管理员账号是否已创建
- ✅ 用户名密码是否正确
- ✅ 浏览器控制台是否有错误

**解决方法**：
```bash
# 重新创建账号
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 问题 3：产品列表为空

**解决方法**：
```bash
# 添加测试产品
node server/seed.js
```

### 问题 4：内容列表为空

**解决方法**：
```bash
# 初始化内容
node server/seed-content.js
```

---

## 📱 页面访问地址速查

### 前台页面
- 首页：`http://localhost:5173/`
- 产品展示：`http://localhost:5173/collections`
- 关于我们：`http://localhost:5173/about`
- 联系我们：`http://localhost:5173/contact`

### 后台页面
- 登录：`http://localhost:5173/admin-login`
- 控制台：`http://localhost:5173/admin/dashboard`
- 产品管理：`http://localhost:5173/admin/products`
- 内容管理：`http://localhost:5173/admin/content`

### 工具页面
- 系统测试：`http://localhost:5173/admin-test.html`

---

## 💡 使用技巧

### 1. 快速测试

运行测试脚本快速验证所有功能：
```bash
./test-fix.sh        # Linux/Mac
test-fix.bat         # Windows
```

### 2. 查看数据库

使用 Prisma Studio：
```bash
cd server
npx prisma studio
```
访问：`http://localhost:5555`

### 3. 清除登录状态

如果需要重新登录：
1. 打开浏览器开发者工具（F12）
2. Application > Local Storage
3. 删除 `admin-token`
4. 刷新页面

### 4. 查看 API 文档

- 产品 API：`/server/API_TEST.md`
- 内容 API：`/server/CONTENT_API_TEST.md`

---

## 🔒 安全提示

⚠️ **开发环境注意事项**：

1. 默认密码仅用于开发测试
2. 生产环境务必修改强密码
3. 不要将管理员凭证提交到代码仓库
4. 定期备份数据库

---

## 📚 完整文档

- **快速启动**：`/QUICK_START.md`
- **后端配置**：`/BACKEND_SETUP.md`
- **管理指南**：`/docs/ADMIN_GUIDE.md`
- **调试指南**：`/DEBUG_ADMIN.md`
- **测试说明**：`/ADMIN_TEST.md`
- **修复记录**：`/FIX_APPLIED.md`

---

## ✅ 验证清单

启动后请确认：

- [ ] 后端运行在 3001 端口
- [ ] 前端运行在 5173 端口
- [ ] 可以访问首页
- [ ] 可以访问登录页面
- [ ] 可以成功登录
- [ ] 可以看到产品管理页面
- [ ] 可以看到内容管理页面
- [ ] 可以编辑和保存内容

---

## 🆘 需要帮助？

如果遇到问题：

1. **查看控制台错误**
   - 浏览器：按 F12
   - 后端：查看终端输出

2. **运行诊断**
   - 访问：`http://localhost:5173/admin-test.html`
   - 或运行：`./test-fix.sh`

3. **检查日志**
   - 后端日志：查看 server 终端
   - 前端日志：浏览器控制台

4. **重启服务**
   - 停止两个终端（Ctrl+C）
   - 重新启动后端和前端

---

## 🎉 开始使用

一切就绪！现在你可以：

1. ✅ 访问 `http://localhost:5173/admin-login`
2. ✅ 使用 `admin` / `admin123` 登录
3. ✅ 开始管理你的网站内容和产品

**祝使用愉快！** 🚀

---

**版本**：v1.0.2  
**更新日期**：2026-02-04  
**状态**：✅ 已修复所有已知问题
