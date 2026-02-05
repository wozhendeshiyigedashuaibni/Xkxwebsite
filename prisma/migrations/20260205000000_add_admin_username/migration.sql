-- Add username login for Admin while keeping email for password reset.
ALTER TABLE "Admin" ADD COLUMN "username" TEXT;

-- Backfill existing rows with deterministic unique usernames based on email prefix.
UPDATE "Admin"
SET "username" = CONCAT(
  COALESCE(NULLIF(split_part(LOWER("email"), '@', 1), ''), 'admin'),
  '_',
  "id"
)
WHERE "username" IS NULL;

ALTER TABLE "Admin" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
