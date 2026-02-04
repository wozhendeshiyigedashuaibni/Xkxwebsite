# Backend Setup Instructions

## Step 1: Install Dependencies

```bash
# Install backend dependencies
cd server
npm install
cd ..
```

## Step 2: Environment Setup

```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env file and update:
# - JWT_SECRET (use a strong random string)
# - SMTP settings (if you want email notifications)
```

## Step 3: Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed initial data (admin user: admin/admin123)
npm run db:seed
```

## Step 4: Start Development

```bash
# Option 1: Start both frontend and backend together
npm start

# Option 2: Start separately
npm run dev      # Frontend on http://localhost:5173
npm run server   # Backend on http://localhost:3001
```

## Default Admin Credentials

```
Username: admin
Password: admin123
```

**⚠️ IMPORTANT: Change the default password after first login!**

## API Endpoints

### Public APIs
- `GET /api/products` - List products
- `GET /api/products/:identifier` - Get product by slug or ID
- `GET /api/content` - Get all content
- `POST /api/leads` - Submit inquiry form
- `POST /api/auth/login` - Admin login

### Admin APIs (requires JWT token)
- `GET /api/admin/products` - Manage products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/content` - Manage content
- `PUT /api/admin/content/:key` - Update content
- `GET /api/admin/leads` - View leads
- `POST /api/admin/upload` - Upload files

## Database Management

```bash
# Open Prisma Studio (visual database editor)
npm run db:studio
```

## Folder Structure

```
/server
  /routes         - API route handlers
  /middleware     - Auth & upload middleware
  /utils          - Email utilities
  index.js        - Express server entry
  seed.js         - Database seeder
/prisma
  schema.prisma   - Database schema
/public/uploads   - Uploaded files storage
```

## Next Steps

After backend is running, proceed to:
1. Frontend API integration (Step 2)
2. Admin UI development (Step 3)
