# Quick Start Guide

## 🚀 Fastest Way to Get Started (Mock Mode)

**No backend setup needed!** Just run:

```bash
npm run dev
```

That's it! The app will work with mock data immediately.

You'll see a yellow banner at the top indicating you're in mock data mode.

---

## 🔧 Switch to Real Backend

When you're ready to use the real backend with database:

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### Step 2: Setup Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Step 3: Seed Sample Data (Optional)

```bash
cd server && node seed.js && cd ..
```

### Step 4: Configure Environment

Create or edit `.env.local`:

```env
VITE_USE_MOCK=false
```

### Step 5: Start Both Servers

**Terminal 1** (Backend):
```bash
npm run server
```

Wait for: `🚀 Server running on http://localhost:3001`

**Terminal 2** (Frontend):
```bash
npm run dev
```

The app will now use real data from the SQLite database!

---

## 📊 View/Edit Database

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

---

## 🔄 Switch Back to Mock Mode

Edit `.env.local`:
```env
VITE_USE_MOCK=true
```

Refresh browser. No need to restart servers.

---

## 🆘 Troubleshooting

### Yellow banner says "Using mock data"
- **If you want mock mode:** This is correct! Ignore it.
- **If you want real backend:** 
  1. Check `.env.local` has `VITE_USE_MOCK=false`
  2. Restart Vite: `npm run dev`
  3. Ensure backend is running: `npm run server`

### "Backend not responding"
Run the backend server:
```bash
npm run server
```

### "Prisma Client not found"
```bash
npx prisma generate
```

### Database errors
Reset the database:
```bash
rm prisma/dev.db
npx prisma migrate dev --name init
cd server && node seed.js
```

---

## 📁 What's What?

- **Mock Data**: `/src/lib/mockData.ts` - Fake products for development
- **API Client**: `/src/lib/api.ts` - Handles API calls with fallback
- **Backend Server**: `/server/index.js` - Express API server
- **Database Schema**: `/prisma/schema.prisma` - Database structure
- **Supabase Functions**: `/supabase/functions/server/` - Edge functions (optional)

---

## 🎯 Recommended Workflow

1. **Start with mock mode** - Fastest way to develop UI
2. **Switch to backend** - When you need to test real data flow
3. **Use Prisma Studio** - To view/edit database visually
4. **Check console** - Logs tell you which mode you're in

---

## 🔗 More Info

- **Full Backend Setup**: See [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **Project Overview**: See [README.md](./README.md)
