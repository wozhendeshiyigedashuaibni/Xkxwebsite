# System Status & Configuration

## ✅ Current Setup Status

### Frontend
- ✅ React 18 + TypeScript + Vite 6
- ✅ React Router 7 (full routing implemented)
- ✅ Tailwind CSS 4
- ✅ Multi-language support (EN/CN/AR)
- ✅ 8 pages fully implemented
- ✅ Mock data integration
- ✅ Development mode banner

### Backend Architecture
- ✅ **Node.js Express Server** (`/server/`)
  - Products API
  - Leads/Contact API
  - Content Management API
  - Auth API
  - Admin API
  
- ✅ **Supabase Edge Functions** (`/supabase/functions/server/`)
  - KV Store utilities
  - Health check endpoint
  - Hono web server

### Database
- ✅ Prisma ORM 7.x (latest version)
- ✅ PostgreSQL (Supabase) configuration ready
- ✅ Schema defined (`/prisma/schema.prisma`)
- ✅ Prisma config (`/prisma.config.ts`) - New format for v7
- ✅ Migrations ready
- ✅ Seed data script

### Configuration Files
- ✅ `.env.example` - Environment variables template
- ✅ `.env` - Backend environment variables (not in Git)
- ✅ `.env.local` - Frontend environment variables
- ✅ `.gitignore` - Proper git exclusions
- ✅ `vite.config.ts` - Proxy to backend configured
- ✅ `prisma.config.ts` - Prisma 7.x database configuration

---

## 🎯 Current Mode: MOCK DATA

The application is currently configured to run in **mock data mode**:

**Advantages:**
- ✅ No backend setup required
- ✅ Instant start with `npm run dev`
- ✅ Perfect for UI/UX development
- ✅ No database dependencies

**Current Config** (`.env.local`):
```env
VITE_USE_MOCK=true
```

**What You See:**
- Yellow banner at bottom: "Development Mode: Using mock data"
- Console logs: "Using mock data" or "Falling back to mock data"
- 8 sample products in Collections page
- All features work with simulated data

---

## 🔄 How to Switch to Real Backend

### Option 1: Use Supabase PostgreSQL (推荐生产环境)

**快速配置（5分钟）**：
1. 参考 [SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md) 
2. 或查看详细指南 [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md)

**快速命令**：
```bash
# 1. 配置 .env 文件（填入 Supabase 连接信息）
cp .env.example .env
# 编辑 .env，填入 DATABASE_URL 和 DIRECT_URL

# 2. 验证配置
npm run db:check

# 3. 推送 schema 到 Supabase
npm run db:push

# 4. 填充初始数据（可选）
npm run db:seed

# 5. 启动服务器
npm run server
```

**优势**：
- ✅ 生产级 PostgreSQL 数据库
- ✅ 自动备份和扩展
- ✅ 免费开始，按需付费
- ✅ 内置数据库管理界面

### Option 2: Use SQLite Locally (开发环境快速测试)

**Step 1:** Install dependencies (one time only)
```bash
cd server && npm install && cd ..
```

**Step 2:** Setup database (one time only)
```bash
npx prisma generate
npx prisma migrate dev --name init
cd server && node seed.js && cd ..
```

**Step 3:** Update config
Edit `.env.local`:
```env
VITE_USE_MOCK=false
```

**Step 4:** Start backend (Terminal 1)
```bash
npm run server
```

**Step 5:** Restart frontend (Terminal 2)
```bash
npm run dev
```

### Method 2: Quick Command
```bash
# All in one (requires terminals to stay open)
npm run start
```

This runs both frontend and backend simultaneously.

---

## 📊 Data Flow

### Mock Mode (Current)
```
User → Frontend → Mock Data (mockData.ts) → UI
```

### Real Backend Mode
```
User → Frontend → Vite Proxy (/api) → Express Server (localhost:3001) → SQLite DB → Response → UI
```

### Optional: Supabase Edge Functions
```
User → Frontend → Supabase Edge Functions → KV Store → Response → UI
```

---

## 🔍 How to Verify Current Mode

### Check Environment Variable
```bash
cat .env.local
```

Should show: `VITE_USE_MOCK=true` (mock mode) or `VITE_USE_MOCK=false` (real backend)

### Check Browser
1. Open app in browser
2. Look for yellow banner at bottom
   - **Present** = Mock mode
   - **Not present** = Real backend mode (or production build)

### Check Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to Collections page
4. Look for logs:
   - `"Using mock data"` = Mock mode
   - `"Falling back to mock data"` = Backend not running, using fallback
   - No such logs = Real backend working

---

## 🛠️ Backend Server Status

### Check if Backend is Running
```bash
curl http://localhost:3001/api/health
```

**Expected Response (if running):**
```json
{"status":"ok","timestamp":"2024-02-04T..."}
```

**Error (if not running):**
```
curl: (7) Failed to connect to localhost port 3001
```

### Start Backend Server
```bash
npm run server
```

**Expected Output:**
```
🚀 Server running on http://localhost:3001
```

---

## 📁 Key Files

| File | Purpose | Status |
|------|---------|--------|
| `/src/lib/api.ts` | API client with fallback | ✅ Working |
| `/src/lib/mockData.ts` | Mock product data | ✅ 8 products |
| `/server/index.js` | Express server entry | ✅ Ready |
| `/server/routes/*.js` | API endpoints | ✅ 5 routes |
| `/prisma/schema.prisma` | Database schema | ✅ 4 models |
| `.env.local` | Frontend config | ✅ Mock mode |
| `.env` | Backend config | ✅ Configured |

---

## 🐛 Troubleshooting

### Issue: Yellow banner won't disappear
**Solution:** Set `VITE_USE_MOCK=false` in `.env.local` and restart `npm run dev`

### Issue: "Backend not responding"
**Solution:** Start backend server: `npm run server`

### Issue: "Prisma Client not found"
**Solution:** Generate client: `npx prisma generate`

### Issue: Empty database
**Solution:** Seed data: `cd server && node seed.js`

### Issue: Port 3001 already in use
**Solution:** 
```bash
# Find process using port 3001
lsof -ti:3001
# Kill it
kill -9 $(lsof -ti:3001)
# Or change port in .env
PORT=3002
```

---

## 📈 Next Steps

### For UI Development
✅ **Current setup is perfect!** Continue using mock mode.

### For Backend Development
1. Switch to real backend (see "How to Switch" above)
2. Use Prisma Studio to view data: `npx prisma studio`
3. Test API endpoints with curl or Postman

### For Production Deployment
1. Build frontend: `npm run build`
2. Set environment variables properly
3. Deploy frontend to static hosting (Vercel, Netlify, etc.)
4. Deploy backend to Node.js hosting (Railway, Render, etc.)
5. Migrate SQLite to PostgreSQL/MySQL for production

---

## 📞 Support

- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **Backend Setup**: [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **Project Overview**: [README.md](./README.md)

---

**Last Updated:** 2024-02-04  
**Current Status:** ✅ Fully Functional in Mock Mode