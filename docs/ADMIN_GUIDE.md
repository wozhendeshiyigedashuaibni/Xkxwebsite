# 后台管理系统使用指南

B2B 女装 OEM/ODM 制造商网站后台管理界面完整使用说明。

---

## 🔗 访问地址

### 登录页面

```
http://localhost:5173/admin-login
```

### 管理页面

- **产品管理**：`http://localhost:5173/admin/products`
- **内容管理**：`http://localhost:5173/admin/content`

---

## 🚀 快速开始

### 步骤 1：启动后端服务器

```bash
cd server
npm run server
```

服务器将在 `http://localhost:3001` 启动。

---

### 步骤 2：启动前端开发服务器

```bash
npm run dev
```

前端将在 `http://localhost:5173` 启动。

---

### 步骤 3：创建管理员账号（首次使用）

如果还没有管理员账号，需要先创建：

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

✅ **成功响应**：`{"message":"Admin created successfully","id":1}`

---

### 步骤 4：登录后台

1. 打开浏览器访问：`http://localhost:5173/admin-login`
2. 输入账号密码：
   - Username: `admin`
   - Password: `admin123`
3. 点击 **Sign in**
4. 登录成功后会自动跳转到产品管理页面

---

## 📦 产品管理

### 访问地址

```
http://localhost:5173/admin/products
```

### 功能特性

#### 1. 产品列表

- ✅ 查看所有产品
- ✅ 显示产品图片、标题、分类、MOQ、状态
- ✅ 实时统计：总数、激活数、精选数、分类数

#### 2. 搜索和筛选

- **搜索**：支持按标题、描述、分类搜索
- **分类筛选**：All / Dresses / Tops / Bottoms / Outerwear / Activewear / Accessories

#### 3. 产品操作

| 操作 | 图标 | 说明 |
|------|------|------|
| 查看 | 👁️ | 预览产品详情（即将支持） |
| 编辑 | ✏️ | 修改产品信息（即将支持） |
| 删除 | 🗑️ | 删除产品（需要二次确认） |

#### 4. 删除产品

1. 点击产品行右侧的 🗑️ 删除按钮
2. 确认提示出现：**Confirm** / **Cancel**
3. 点击 **Confirm** 确认删除
4. 删除成功后显示绿色提示消息

#### 5. 状态标识

- **Active** - 绿色标签，表示产品已激活
- **Featured** - 黄色标签，表示产品为精选推荐

### 产品数据统计

页面底部显示：

- **Total Products** - 总产品数
- **Active** - 激活的产品数
- **Featured** - 精选产品数
- **Categories** - 产品分类数

---

## 📝 内容管理

### 访问地址

```
http://localhost:5173/admin/content
```

### 功能特性

#### 1. 内容列表

- ✅ 按页面分组显示（home、about、factory 等）
- ✅ 展开/收起分组
- ✅ 显示最后更新时间
- ✅ JSON 格式预览

#### 2. 搜索内容

输入 key 或内容关键词进行搜索，支持实时筛选。

#### 3. 编辑内容

**步骤**：

1. 点击内容卡片右上角的 **Edit** 按钮
2. 在文本框中编辑 JSON 内容
3. 点击 **Save** 保存更改
4. 或点击 **Cancel** 取消编辑

**注意事项**：

- ✅ 内容必须是有效的 JSON 格式
- ✅ 格式错误会显示提示信息
- ✅ 保存后立即生效

#### 4. 内容分组

内容按前缀自动分组：

| 分组 | 说明 | 示例 Key |
|------|------|----------|
| `home` | 首页内容 | `home.hero.title` |
| `about` | 关于我们 | `about.company.description` |
| `factory` | 工厂介绍 | `factory.capabilities` |
| `oem-odm` | OEM/ODM 服务 | `oem-odm.process` |
| `contact` | 联系我们 | `contact.info` |
| `footer` | 页脚 | `footer.copyright` |

#### 5. JSON 格式示例

**简单文本**：

```json
{
  "text": "Your content here",
  "description": "Description for admin"
}
```

**数组列表**：

```json
{
  "items": [
    { "label": "Item 1", "value": "Value 1" },
    { "label": "Item 2", "value": "Value 2" }
  ],
  "description": "List of items"
}
```

**复杂对象**：

```json
{
  "title": "Section Title",
  "items": [
    {
      "title": "Sub Item",
      "description": "Description"
    }
  ],
  "metadata": {
    "key": "value"
  }
}
```

### 初始化内容数据

如果内容为空或需要重置，运行：

```bash
node server/seed-content.js
```

这将创建 22 个预定义的内容项。

---

## 🎨 界面功能

### 侧边栏导航

**桌面端**：

- 可折叠侧边栏（点击左上角按钮）
- 折叠时显示图标和悬停提示
- 高亮当前活动页面

**移动端**：

- 抽屉式侧边栏
- 点击菜单按钮打开
- 点击遮罩或关闭按钮关闭

### 顶部栏

- 显示当前页面标题
- **View Site →** 链接：新窗口打开前台网站

### 用户信息

侧边栏底部显示：

- 用户头像（首字母）
- 用户名
- **Logout** 按钮

---

## 🔐 权限和认证

### JWT Token

- 登录成功后自动保存 Token
- Token 有效期：7 天
- Token 存储在浏览器 localStorage

### 受保护的路由

以下路由需要登录：

- `/admin/products`
- `/admin/content`

未登录访问会自动跳转到 `/admin-login`。

### 登出

1. 点击侧边栏底部的 **Logout** 按钮
2. 自动清除 Token
3. 跳转到登录页面

---

## 📱 响应式设计

### 桌面端（≥ 768px）

- 侧边栏固定在左侧
- 可折叠侧边栏
- 内容区域自适应宽度

### 移动端（< 768px）

- 抽屉式侧边栏
- 汉堡菜单按钮
- 表格横向滚动

---

## 🎯 使用场景

### 场景 1：添加新产品

**步骤**：

1. 访问 `/admin/products`
2. 点击右上角 **Add Product** 按钮
3. 填写产品信息（即将支持）
4. 保存后显示在产品列表

### 场景 2：修改首页文案

**步骤**：

1. 访问 `/admin/content`
2. 展开 **home** 分组
3. 找到 `home.hero.title`
4. 点击 **Edit**
5. 修改 JSON 内容：
   ```json
   {
     "text": "新的标题文案",
     "description": "首页 Hero 标题"
   }
   ```
6. 点击 **Save**
7. 刷新前台页面查看效果

### 场景 3：删除过期产品

**步骤**：

1. 访问 `/admin/products`
2. 使用搜索或筛选找到目标产品
3. 点击产品行右侧的删除图标
4. 确认删除
5. 产品从列表中移除

### 场景 4：批量查看分类产品

**步骤**：

1. 访问 `/admin/products`
2. 点击分类筛选按钮（如 **Dresses**）
3. 查看该分类下的所有产品
4. 使用搜索进一步筛选

---

## ⚠️ 注意事项

### 产品管理

- ❌ 删除操作不可恢复，请谨慎操作
- ✅ 删除前会要求二次确认
- ✅ 支持按分类和关键词快速筛选

### 内容管理

- ❌ 必须保持 JSON 格式正确
- ❌ 格式错误会导致保存失败
- ✅ 修改后立即生效
- ✅ 可通过 seed 脚本重置内容

### 数据同步

- ✅ 后台修改立即反映到前台
- ✅ 多个管理员同时操作时，刷新页面获取最新数据
- ✅ 无需重启服务器

---

## 🐛 常见问题

### Q1: 登录后无法访问管理页面

**原因**：Token 可能过期或无效

**解决**：

1. 清除浏览器缓存
2. 重新登录
3. 检查后端服务器是否运行

---

### Q2: 产品列表为空

**原因**：数据库中没有产品数据

**解决**：

使用 API 添加测试产品，或参考 `/server/API_TEST.md` 使用 cURL 创建产品。

---

### Q3: 内容列表为空

**原因**：未初始化内容数据

**解决**：

```bash
node server/seed-content.js
```

---

### Q4: 保存内容时提示 "Invalid JSON format"

**原因**：JSON 格式不正确

**解决**：

1. 检查是否有多余的逗号
2. 确保引号成对出现
3. 使用 JSON 验证工具检查格式
4. 示例正确格式：
   ```json
   {
     "text": "Content",
     "description": "Desc"
   }
   ```

---

### Q5: 移动端侧边栏无法打开

**原因**：JavaScript 错误或浏览器兼容性问题

**解决**：

1. 刷新页面
2. 检查浏览器控制台是否有错误
3. 尝试使用现代浏览器（Chrome、Edge、Safari）

---

## 🚀 下一步功能

### 即将支持

- ✅ 产品新增和编辑表单
- ✅ 产品图片上传
- ✅ 批量操作（批量删除、批量激活）
- ✅ 询盘管理页面
- ✅ 数据统计仪表板
- ✅ 操作日志
- ✅ 多管理员权限管理

---

## 📞 技术支持

### 文档

- **产品 API**：`/server/API_TEST.md`
- **内容 API**：`/server/CONTENT_API_TEST.md`
- **快速启动**：`/server/QUICK_START.md`

### 测试脚本

```bash
# 测试产品 API
node server/test-admin-api.js

# 测试内容 API
node server/test-content-api.js
```

### 数据库管理

```bash
# 打开 Prisma Studio（可视化数据库管理）
npx prisma studio
```

访问：`http://localhost:5555`

---

## 🎉 总结

你现在可以：

✅ 登录后台管理系统  
✅ 查看和管理产品列表  
✅ 编辑网站内容文案  
✅ 通过侧边栏导航在各个模块间切换  
✅ 在移动端和桌面端使用后台管理  

---

**更新日期**：2026-02-04  
**版本**：v1.0.0  
**技术栈**：React + TypeScript + Tailwind CSS + React Router
