# 后台管理 API 服务

B2B 女装 OEM/ODM 制造商网站的后端服务，提供产品管理、内容管理和询盘线索收集功能。

## 🚀 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 数据库（通过 Supabase）
- npm 或 yarn

### 安装依赖

```bash
cd server
npm install
```

### 环境配置

在项目根目录创建 `.env` 文件：

```env
# 数据库
DATABASE_URL="your_postgresql_connection_string"

# JWT 密钥
JWT_SECRET="your_secret_key_here"

# 服务器配置
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma db push

# （可选）初始化网站内容数据
node server/seed-content.js
```

### 启动服务器

```bash
npm run server
```

服务器将在 `http://localhost:3001` 启动。

---

## 📚 API 文档

### 认证 API

- **POST** `/api/auth/register` - 注册管理员账号
- **POST** `/api/auth/login` - 管理员登录

### 产品管理 API

详细文档：[API_TEST.md](./API_TEST.md)

- **GET** `/api/admin/products` - 获取所有产品
- **GET** `/api/admin/products/:id` - 获取单个产品
- **POST** `/api/admin/products` - 创建产品
- **PUT** `/api/admin/products/:id` - 更新产品
- **DELETE** `/api/admin/products/:id` - 删除产品

### 内容管理 API

详细文档：[CONTENT_API_TEST.md](./CONTENT_API_TEST.md)

- **GET** `/api/admin/content` - 获取所有内容
- **GET** `/api/admin/content/:key` - 获取单个内容
- **PUT** `/api/admin/content/:key` - 创建或更新内容
- **DELETE** `/api/admin/content/:key` - 删除内容

### 询盘线索 API

- **POST** `/api/leads` - 提交询盘（公开接口）
- **GET** `/api/admin/leads` - 获取所有线索（需要认证）
- **GET** `/api/admin/leads/:id` - 获取单个线索（需要认证）
- **PUT** `/api/admin/leads/:id` - 更新线索状态（需要认证）

### 公开 API

- **GET** `/api/products` - 获取产品列表（前台展示）
- **GET** `/api/products/:identifier` - 获取产品详情（前台展示）
- **GET** `/api/content` - 获取网站内容（前台展示）
- **GET** `/api/health` - 健康检查

---

## 🧪 测试

### 自动化测试脚本

#### 产品管理 API 测试

```bash
node server/test-admin-api.js
```

#### 内容管理 API 测试

```bash
node server/test-content-api.js
```

### 手动测试

#### 1. 创建管理员账号

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### 2. 登录获取 Token

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### 3. 测试受保护的 API

```bash
# 替换 YOUR_TOKEN 为登录返回的 token
curl -X GET http://localhost:3001/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📁 项目结构

```
server/
├── index.js                 # 服务器入口
├── routes/
│   ├── auth.js              # 认证路由
│   ├── admin.js             # 管理员路由（产品、内容、线索）
│   ├── products.js          # 公开产品路由
│   ├── content.js           # 公开内容路由
│   └── leads.js             # 询盘提交路由
├── middleware/
│   ├── auth.js              # JWT 认证中间件
│   └── upload.js            # 文件上传中间件
├── utils/                   # 工具函数
├── seed.js                  # 数据库种子文件
├── seed-content.js          # 内容初始化脚本
├── test-admin-api.js        # 产品 API 测试脚本
├── test-content-api.js      # 内容 API 测试脚本
├── API_TEST.md              # 产品 API 文档
├── CONTENT_API_TEST.md      # 内容 API 文档
└── README.md                # 本文件
```

---

## 🗄️ 数据库结构

### Admin 表

管理员账号

```prisma
model Admin {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String   // bcrypt 加密
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Product 表

产品信息

```prisma
model Product {
  id                Int      @id @default(autoincrement())
  slug              String   @unique
  title             String
  category          String   // 6大分类
  subcategory       String?
  mainImage         String
  images            String   // JSON 数组
  description       String
  moq               String
  sampleLeadTime    String
  bulkLeadTime      String
  material          String
  process           String
  capacity          String
  packaging         String
  customOptions     String   // JSON 数组
  tags              String   // JSON 数组
  price             String?
  featured          Boolean  @default(false)
  active            Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### Content 表

网站内容

```prisma
model Content {
  id        Int      @id @default(autoincrement())
  key       String   @unique
  value     String   // JSON
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Lead 表

询盘线索

```prisma
model Lead {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  company   String?
  phone     String?
  message   String
  files     String?  // JSON 数组
  status    String   @default("new")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🔐 安全

### JWT 认证

所有管理接口 (`/api/admin/*`) 都需要 JWT Token：

```
Authorization: Bearer <token>
```

Token 有效期：7 天

### 密码加密

管理员密码使用 bcryptjs 加密存储，salt rounds = 10。

### CORS 配置

默认只允许 `http://localhost:5173` 的跨域请求，生产环境需要配置正确的域名。

---

## 🚀 部署

### Vercel 部署

1. 安装 Vercel CLI：

```bash
npm i -g vercel
```

2. 配置 `vercel.json`（已配置）

3. 部署：

```bash
vercel --prod
```

4. 配置环境变量：

在 Vercel 项目设置中添加：
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`

### 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | JWT 签名密钥 | 随机字符串 |
| `PORT` | 服务器端口 | `3001` |
| `NODE_ENV` | 运行环境 | `development` / `production` |
| `FRONTEND_URL` | 前端 URL（CORS） | `http://localhost:5173` |

---

## 📊 产品分类

系统支持 6 个女装分类：

1. **Dresses** - 连衣裙
2. **Tops** - 上衣
3. **Bottoms** - 下装
4. **Outerwear** - 外套
5. **Activewear** - 运动服
6. **Accessories** - 配饰

---

## 🛠️ 开发工具

### 推荐的 API 测试工具

- **cURL** - 命令行工具
- **Postman** - 图形化 API 测试
- **Thunder Client** - VS Code 插件
- **Insomnia** - 跨平台 REST 客户端

### 数据库管理

```bash
# Prisma Studio - 可视化数据库管理
npx prisma studio
```

访问 `http://localhost:5555` 查看和编辑数据。

---

## 📝 开发日志

### v1.0.0 (2026-02-04)

- ✅ 实现产品 CRUD API
- ✅ 实现内容管理 API
- ✅ 实现询盘线索管理
- ✅ JWT 认证系统
- ✅ 完整的 API 测试文档
- ✅ 自动化测试脚本
- ✅ 内容初始化脚本

---

## 🐛 常见问题

### Q: 数据库连接失败

A: 检查 `.env` 文件中的 `DATABASE_URL` 是否正确。

### Q: JWT Token 无效

A: Token 可能已过���（7天有效期），需要重新登录。

### Q: CORS 错误

A: 检查 `FRONTEND_URL` 环境变量是否匹配前端地址。

### Q: 如何重置数据库

A: 

```bash
# 重置数据库（删除所有数据）
npx prisma db push --force-reset

# 重新生成客户端
npx prisma generate

# 重新初始化内容
node server/seed-content.js
```

---

## 📞 技术支持

- **文档问题**：查看 `API_TEST.md` 和 `CONTENT_API_TEST.md`
- **测试脚本**：运行 `test-admin-api.js` 和 `test-content-api.js`
- **数据库问题**：使用 `npx prisma studio` 可视化管理

---

**版本**：v1.0.0  
**更新日期**：2026-02-04  
**技术栈**：Node.js + Express + Prisma + PostgreSQL + JWT
