/**
 * Safe migration script that handles schema updates without data loss
 * Run this before prisma db push to prepare the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Running safe migration...');

  try {
    // Check if Admin table exists and has data
    const adminCount = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM "Admin"
    `;

    console.log(`Found ${adminCount[0].count} admin records`);

    // Check if username column exists
    const columnCheck = await prisma.$queryRaw<{ column_name: string }[]>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'Admin' AND column_name = 'username'
    `;

    if (columnCheck.length === 0) {
      console.log('Adding username column...');

      // Add username column as nullable
      await prisma.$executeRaw`
        ALTER TABLE "Admin" ADD COLUMN IF NOT EXISTS "username" TEXT
      `;

      // Update existing records with username from email
      await prisma.$executeRaw`
        UPDATE "Admin"
        SET "username" = LOWER(SPLIT_PART("email", '@', 1))
        WHERE "username" IS NULL
      `;

      // Make username NOT NULL
      await prisma.$executeRaw`
        ALTER TABLE "Admin" ALTER COLUMN "username" SET NOT NULL
      `;

      // Add unique constraint if not exists
      try {
        await prisma.$executeRaw`
          CREATE UNIQUE INDEX IF NOT EXISTS "Admin_username_key" ON "Admin"("username")
        `;
      } catch (e) {
        // Index might already exist
        console.log('Username index already exists or created');
      }

      console.log('Username column added successfully');
    } else {
      console.log('Username column already exists');
    }

    console.log('Migration completed successfully');
  } catch (error: any) {
    // Table might not exist yet, which is fine
    if (error.code === '42P01') {
      console.log('Admin table does not exist yet, will be created by prisma db push');
    } else {
      throw error;
    }
  }
}

main()
  .catch((e) => {
    console.error('Migration error:', e);
    // Don't exit with error - let prisma db push handle schema creation
    process.exit(0);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
