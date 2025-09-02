-- CreateEnum
CREATE TYPE "public"."profilePhoto" AS ENUM ('PHOTO1', 'PHOTO2', 'PHOTO3', 'PHOTO4');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "profilePhoto" "public"."profilePhoto" NOT NULL DEFAULT 'PHOTO1';
