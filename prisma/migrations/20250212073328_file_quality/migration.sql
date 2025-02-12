/*
  Warnings:

  - You are about to drop the column `filename` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `mime_type` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `files` table. All the data in the column will be lost.
  - You are about to drop the `otps` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `url` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "file_quality" AS ENUM ('low', 'medium', 'high', 'original');

-- AlterTable
ALTER TABLE "files" DROP COLUMN "filename",
DROP COLUMN "mime_type",
DROP COLUMN "path",
DROP COLUMN "size",
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "report_files" ADD COLUMN     "quality" "file_quality" NOT NULL DEFAULT 'low';

-- AlterTable
ALTER TABLE "user_preferences" ADD COLUMN     "image_quality" "file_quality" NOT NULL DEFAULT 'low',
ADD COLUMN     "watermark" TEXT;

-- DropTable
DROP TABLE "otps";

-- CreateIndex
CREATE INDEX "report_files_quality_idx" ON "report_files"("quality");
