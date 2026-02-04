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

```bash
# 1. Install & setup
cd server && npm install && cd ..
npx prisma generate
npx prisma migrate dev --name init

# 2. Configure
echo "VITE_USE_MOCK=false" > .env.local

# 3. Start backend (Terminal 1)
npm run server

# 4. Start frontend (Terminal 2)
npm run dev
```

👉 **See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed setup**

## Features

- ✅ **Product Catalog** - 6 clothing categories with filtering
- ✅ **Product Details** - Comprehensive specifications (MOQ, lead time, materials)
- ✅ **Contact Forms** - Lead collection with file uploads
- ✅ **Multi-language** - Support for English, Chinese, and Arabic
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Backend API** - Node.js + Express + SQLite + Prisma
- ✅ **Mock Data Mode** - Develop without backend dependencies

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- React Router 7

**Backend:**
- Node.js + Express
- SQLite + Prisma ORM
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

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run build` - Build for production
- `npx prisma studio` - Open database GUI

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

- [Backend Setup Guide](./BACKEND_SETUP.md) - Complete backend configuration
- [Setup Instructions](./SETUP.md) - Original setup documentation

## License

Private - Xikaixi Manufacturing