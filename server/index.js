import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import contentRoutes from './routes/content.js';
import leadRoutes from './routes/leads.js';
import adminRoutes from './routes/admin.js';

// Load environment variables from root directory .env file
dotenv.config({ path: '../.env' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});
const PORT = process.env.PORT || 3001;

// Export prisma for use in routes
export { prisma };

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('💡 Please check your DATABASE_URL in .env file');
    process.exit(1);
  }
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/leads', leadRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    // Test database connectivity
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      database: 'disconnected',
      message: error.message,
      timestamp: new Date().toISOString() 
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
testDatabaseConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
});
