# 🎯 后台管理快速访问

## 🔗 访问地址

### 方法 1：直接访问登录页面
```
http://localhost:5173/admin-login
```

### 方法 2：从首页进入（隐藏入口）
1. 访问网站首页：`http://localhost:5173/`
2. 滚动到页脚底部
3. 在版权信息下方有一个隐藏的小圆点 `•`
4. 鼠标悬停圆点会变亮，点击进入登录页

### 管理页面
- **产品管理**：`http://localhost:5173/admin/products`
- **内容管理**：`http://localhost:5173/admin/content`

---

## 🔑 默认账号

```
Username: admin
Password: admin123
```

⚠️ **首次使用需要先创建账号**：

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 🚀 启动服务

### 1. 启动后端
```bash
cd server
npm run server
```

### 2. 启动前端
```bash
npm run dev
```

---

## 📖 完整文档

详细使用说明请查看：[`/docs/ADMIN_GUIDE.md`](./docs/ADMIN_GUIDE.md)

---

## ✅ 功能清单

### 产品管理 (`/admin/products`)
- ✅ 产品列表（图片、标题、分类、MOQ、状态）
- ✅ 搜索产品
- ✅ 按分类筛选（6 大分类）
- ✅ 删除产品（二次确认）
- ✅ 数据统计（总数、激活、精选、分类）
- 🔜 新增产品
- 🔜 编辑产品

### 内容管理 (`/admin/content`)
- ✅ 内容列表（按页面分组）
- ✅ 搜索内容
- ✅ 展开/收起分组
- ✅ 编辑 JSON 内容
- ✅ 实时保存
- ✅ 格式验证

### 布局功能
- ✅ 侧边栏导航（可折叠）
- ✅ 响应式设计（桌面 + 移动）
- ✅ 用户信息显示
- ✅ 登出功能
- ✅ View Site 链接

---

## 🎨 界面预览

### 产品管理
- 表格展示所有产品
- 搜索栏 + 分类筛选
- 操作按钮：查看、编辑、删除
- 底部统计卡片

### 内容管理
- 按页面分组（home、about、factory 等）
- 可折叠分组卡片
- JSON 编辑器
- 保存/取消按钮

---

## 📝 快速操作

### 初始化内容数据
```bash
node server/seed-content.js
```

### 测试 API
```bash
# 产品 API
node server/test-admin-api.js

# 内容 API
node server/test-content-api.js
```

### 数据库管理
```bash
npx prisma studio
# 访问 http://localhost:5555
```

---

**版本**：v1.0.0  
**更新**：2026-02-04