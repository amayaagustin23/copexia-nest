-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN';
