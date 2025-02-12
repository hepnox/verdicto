/*
  Warnings:

  - Added the required column `full_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "full_name" TEXT NOT NULL;
