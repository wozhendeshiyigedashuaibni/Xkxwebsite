# 🚀 部署指南

## ⚠️ 重要提醒：Figma Make 同步问题

**问题**：Figma Make 的同步可能会覆盖以下关键配置文件：
- `prisma.config.ts` - 被改回旧版本（不兼容 Prisma 7.x）
- `package.json` - 缺少后端依赖
- `vercel.json` - 被删除

**解决方案**：每次从 Figma Make 同步后，请检查并恢复这些文件！

---

## 📦 Vercel 部署步骤

### 1. 前置检查

确认以下文件存在且正确：

✅ `prisma.config.ts` - Prisma 7.x 兼容配置
```typescript
export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || '',
      directUrl: process.env.DIRECT_URL || '',
    },
  },
}
```

✅ `package.json` - 包含后端依赖
```json
"dependencies": {
  "prisma": "^6.1.0",
  "@prisma/client": "^6.1.0",
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "multer": "^1.4.5-lts.1"
}
```

✅ `vercel.json` - Vercel 部署配置

---

### 2. 在 Vercel 中配置环境变量

进入 Vercel 项目 → **Settings** → **Environment Variables**

添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://...` | Supabase 连接池 URL |
| `DIRECT_URL` | `postgresql://...` | Supabase 直连 URL |
| `JWT_SECRET` | `随机生成的密钥` | JWT 加密密钥 |

**获取 Supabase 数据库 URL**：
1. 登录 Supabase 项目
2. Settings → Database → Connection string
3. 选择 "Transaction" 模式（用于 DATABASE_URL）
4. 选择 "Session" 模式（用于 DIRECT_URL）

**生成 JWT_SECRET**：
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### 3. 部署到 Vercel

#### 方法 A：通过 GitHub（推荐）

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入 GitHub 仓库
3. Vercel 自动检测为 Vite 项目
4. 点击 **Deploy**

#### 方法 B：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

---

### 4. 配置自定义域名

#### 在 Vercel 中添加域名

1. 进入项目 → **Settings** → **Domains**
2. 添加域名：
   - `xikaixi.cn`
   - `www.xikaixi.cn`

#### 配置 DNS 记录

Vercel 会显示需要添加的 DNS 记录，示例：

**在域名注册商（阿里云/腾讯云）配置**：

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|--------|-----|
| A | @ | 76.76.21.21 | 600 |
| CNAME | www | cname.vercel-dns.com | 600 |

⚠️ **实际值以 Vercel 显示为准！**

#### 验证 DNS

```bash
# 检查 DNS 是否生效
nslookup xikaixi.cn

# 或使用在线工具
# https://dnschecker.org
```

---

## 🇨🇳 .cn 域名备案问题

### ⚠️ 重要提醒

如果你的网站托管在 Vercel（美国服务器），.cn 域名需要 ICP 备案才能在中国大陆访问。

### 解决方案

#### 选项 1：完成 ICP 备案
- 购买中国大陆服务器（阿里云/腾讯云）
- 提交备案申请（需要 15-20 天）
- 备案通过后才能正常访问

#### 选项 2：使用国际域名
- 购买 `.com` / `.net` / `.io` 域名
- 无需备案，立即可用
- 推荐：`xikaixi.com`

#### 选项 3：临时使用 Vercel 免费域名
- `https://你的项目名.vercel.app`
- 立即可用，无需配置

---

## 🔧 故障排查

### 问题 1：部署失败

**检查**：
```bash
# 本地测试构建
npm run build

# 如果失败，检查错误信息
```

**常见原因**：
- TypeScript 类型错误
- 缺少依赖包
- 环境变量未配置

### 问题 2：域名无法访问

**检查清单**：
- [ ] DNS 是否已配置
- [ ] DNS 是否已生效（等待 10 分钟 - 48 小时）
- [ ] Vercel 域名状态是否为 "Valid Configuration"
- [ ] 浏览器缓存已清除
- [ ] .cn 域名是否已备案（如使用 Vercel）

### 问题 3：API 请求失败

**检查**：
- [ ] 环境变量是否正确配置
- [ ] DATABASE_URL 和 DIRECT_URL 是否有效
- [ ] Supabase 数据库是否正常运行

---

## 📝 部署检查清单

部署前确认：

- [ ] `prisma.config.ts` 使用正确版本
- [ ] `package.json` 包含所有后端依赖
- [ ] `vercel.json` 配置文件存在
- [ ] 环境变量已在 Vercel 中配置
- [ ] 本地 `npm run build` 成功
- [ ] DNS 记录已添加
- [ ] （可选）.cn 域名已完成备案

---

## 🆘 需要帮助？

如果部署遇到问题：

1. 检查 Vercel 部署日志
2. 查看浏览器控制台错误
3. 验证环境变量配置
4. 确认 DNS 配置正确

---

**最后更新**：2026-02-04
