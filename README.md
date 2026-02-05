# Xikaixi B2B Women's Apparel OEM/ODM Platform

Professional B2B manufacturing website for women's apparel with backend management system.

## 🚀 Quick Start

### Option 1: Mock Data (Instant - Recommended for Development)

```bash
npm run dev
```

**That's it!** The app works immediately with mock data. Perfect for UI development.

👉 **See [QUICK_START.md](./QUICK_START.md) for complete guide**

### Option 2: Real Backend (For Production-like Testing)

**快速开始（使用 Supabase PostgreSQL）**:
```bash
# 1. 配置 Supabase 数据库（参考 SUPABASE_QUICKSTART.md）
cp .env.example .env
# 编辑 .env，填入 Supabase 连接信息

# 2. 验证并推送 schema
npm run db:check
npm run db:push

# 3. 启动服务器
npm run server
```

**或使用 SQLite 本地测试**:
```bash
# 1. Install & setup
cd server && npm install && cd ..\nnpx prisma generate
npx prisma migrate dev --name init

# 2. Configure
echo "VITE_USE_MOCK=false" > .env.local

# 3. Start backend (Terminal 1)
npm run server

# 4. Start frontend (Terminal 2)
npm run dev
```

👉 **Supabase 配置**: [SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md) (5分钟快速配置)  
👉 **详细配置指南**: [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md)  
👉 **后端设置**: [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed setup


## Production Backend (Vercel)

- 线上环境统一使用 `api/` 目录下的 Vercel Functions（如 `/api/login`、`/api/admin/*`）。
- `server/` 目录仅保留为本地调试参考，不作为线上部署入口，避免与 `api/` 双后端并存导致鉴权逻辑冲突。


## 后台管理员注册与登录

- 登录接口：`POST /api/login`（用户名 + 密码，兼容误填邮箱）
- 注册接口：`POST /api/register`（用户名 + 邮箱 + 密码）
- 忘记密码：`POST /api/forgot-password`（邮箱）

示例：

```bash
curl -X POST https://<domain>/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"admin12345"}'
```

```bash
curl -X POST https://<domain>/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin12345"}'
```

## Features

- ✅ **Product Catalog** - 6 clothing categories with filtering
- ✅ **Product Details** - Comprehensive specifications (MOQ, lead time, materials)
- ✅ **Contact Forms** - Lead collection with file uploads
- ✅ **Multi-language** - Support for English, Chinese, and Arabic
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Backend API** - Vercel Functions (`api/`) + Prisma
- ✅ **Mock Data Mode** - Develop without backend dependencies

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- React Router 7

**Backend:**
- Node.js + Express
- PostgreSQL (Supabase) / SQLite
- Prisma ORM 7.x
- JWT Authentication
- Multer (file uploads)

## Project Structure

```
/src/app/          # Frontend application
  /components/     # Reusable React components
  /pages/          # Page components
/src/lib/          # Utilities (API client, mock data)
/server/           # Backend server
  /routes/         # API routes
  /middleware/     # Auth, upload handlers
/prisma/           # Database schema
```

## Environment Variables

Create `.env.local`:

```env
# Use mock data (default: true)
VITE_USE_MOCK=true

# API URL (only needed if backend runs on different port)
# VITE_API_URL=http://localhost:3001/api
```

## GitHub 自动同步（提交后自动 push）

项目已内置 `post-commit` hook（`.githooks/post-commit`）：

1. 首次执行（一次即可）：
   ```bash
   npm run setup:auto-push
   ```
2. 之后每次 `git commit` 完成后，会自动执行 `git push origin <当前分支>`。
3. 临时禁用自动推送：
   ```bash
   AUTO_PUSH_TO_GITHUB=0 git commit -m "message"
   ```

> 注意：需要本地已配置 `origin` 远端并具备 push 权限。

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run build` - Build for production
- `npm run db:check` - Check Supabase database connection
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create migration files
- `npm run db:generate` - Generate Prisma Client
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio GUI

## Troubleshooting

### "Backend server not responding" errors

**If you see these console errors:**
- `Backend server not responding. Please ensure backend is running on port 3001.`
- `⚠️  Backend server is not running. Using mock data.`

**Don't worry!** This is normal in development mode. The app automatically falls back to mock data.

**To remove these warnings:**
1. Check that `.env.local` exists in project root
2. Ensure it contains: `VITE_USE_MOCK=true`
3. Restart the dev server: `npm run dev`
4. Visit `http://localhost:5173/env-check.html` to verify configuration

**If you want to use the real backend instead:**
1. Install dependencies: `cd server && npm install && cd ..`
2. Setup database: `npx prisma generate && npx prisma migrate dev`
3. Start backend: `npm run server` (separate terminal)
4. Change `.env.local`: `VITE_USE_MOCK=false`
5. Restart frontend: `npm run dev`

### App shows yellow banner

✅ **This is correct!** The banner indicates you're in development mode with mock data.

To hide it:
- Set `VITE_USE_MOCK=false` in `.env.local` and start the backend server

### Vite not loading environment variables

Restart the dev server. Vite only loads `.env` files on startup.

## Documentation

- [Supabase 快速配置](./SUPABASE_QUICKSTART.md) - 5分钟快速连接 Supabase 数据库
- [Supabase 详细配置](./SUPABASE_CONFIG.md) - 完整的 Supabase 配置和故障排查
- [数据库迁移指南](./MIGRATION_GUIDE.md) - Prisma 7.x 迁移说明
- [Backend Setup Guide](./BACKEND_SETUP.md) - Complete backend configuration
- [System Status](./SYSTEM_STATUS.md) - Current setup status and troubleshooting
- [Setup Instructions](./SETUP.md) - Original setup documentation

## License

Private - Xikaixi Manufacturing