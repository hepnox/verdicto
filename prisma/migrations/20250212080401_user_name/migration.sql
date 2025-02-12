/*
  Warnings:

  - You are about to drop the column `filename` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `mime_type` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `files` table. All the data in the column will be lost.
  - You are about to drop the `otps` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `url` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "filename",
DROP COLUMN "mime_type",
DROP COLUMN "path",
DROP COLUMN "size",
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "full_name" TEXT NOT NULL;

-- DropTable
DROP TABLE "otps";
