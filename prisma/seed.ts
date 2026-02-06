import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'XKX';
  const email = 'admin@xikaixi.cn';
  const password = 'xikaixi68168..';

  const passwordHash = await bcrypt.hash(password, 10);

  // Upsert admin user (create or update if exists)
  const admin = await prisma.admin.upsert({
    where: { username },
    update: {
      passwordHash,
      email,
      tokenVersion: 0,
    },
    create: {
      username,
      email,
      passwordHash,
      role: 'admin',
      tokenVersion: 0,
    },
  });

  console.log('Admin user created/updated:', {
    id: admin.id,
    username: admin.username,
    email: admin.email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
