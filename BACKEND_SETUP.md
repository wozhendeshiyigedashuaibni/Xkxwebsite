# Backend Setup Instructions

## Development Mode (Default)

By defaArchitecture Overview

This project supports **two backend options**:

1. **Mock Data Mode** (Default) - No setup required, instant development
2. **Dual Backend Mode** - Both Node.js Express server AND Supabase Edge Functions

### Backend Architecture

```
┌─────────────────┐
│    Frontend     │
│   (React App)   │
└────────┬────────┘
         │
    ┌────┴────────────────────────┐
    │                             │
┌───▼──────────────┐  ┌──────────▼────────────┐
│  Node.js Server  │  │  Supabase Edge Funcs  │
│  localhost:3001  │  │  (Hono Server)        │
│                  │  │                       │
│  - Products API  │  │  - KV Store           │
│  - Leads API     │  │  - Health Check       │
│  - Content API   │  │                       │
└──────────────────┘  └───────────────────────┘
```

## ult, the application uses **mock data** for development. No backend server is required!

The app will work immediately with sample products. This is perfect for:
- Frontend development
- UI/UX testing  
- Demo purposes
- Working without backend dependencies

## Switching to Real Backend

To connect to the real backend server, follow these steps:

### 1. Install Server Dependencies
```bash
cd server
npm install
cd ..
```

### 2. Initialize Database
```bash
# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Optional: Seed database with sample data
cd server && node seed.js
```

### 3. Configure Environment

Edit `.env.local` and set:
```env
VITE_USE_MOCK=false
```

### 4. Start Backend Server
```bash
# In one terminal window:
npm run server
```

The backend server will start on `http://localhost:3001`

### 5. Restart Frontend
```bash
# Stop the frontend (Ctrl+C) and restart:
npm run dev
```

The frontend will now connect to the real backend!

## Switching Back to Mock Data

Simply edit `.env.local`:
```env
VITE_USE_MOCK=true
```

Then restart the frontend (Ctrl+C and `npm run dev`).

## Troubleshooting

### Error: "Backend server not responding"

This means the backend server is not running. 

**Solution:**
1. Open a separate terminal window
2. Run `npm run server`
3. Wait for the message: "🚀 Server running on http://localhost:3001"
4. Refresh your frontend browser

### Error: "Prisma Client not found"

**Solution:**
```bash
npx prisma generate
```

### Error: "Table does not exist"

**Solution:**
```bash
npx prisma migrate dev
```

### Database Reset

If you need to reset the database:
```bash
# Delete the database file
rm prisma/dev.db

# Recreate and migrate
npx prisma migrate dev --name init

# Reseed (optional)
cd server && node seed.js
```

## Database Access

To view and edit the database in a GUI:
```bash
npx prisma studio
```

This will open Prisma Studio at `http://localhost:5555`

## API Endpoints

Once the backend is running, you can test these endpoints:

- `GET http://localhost:3001/api/health` - Health check
- `GET http://localhost:3001/api/products` - Get all products
- `GET http://localhost:3001/api/products/:id` - Get product by ID or slug
- `POST http://localhost:3001/api/leads` - Submit contact form

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3001
JWT_SECRET="your-secret-key-change-in-production"
```

## Production Deployment

For production, use:
```bash
npm run build
```

Make sure to set proper environment variables for your production database.