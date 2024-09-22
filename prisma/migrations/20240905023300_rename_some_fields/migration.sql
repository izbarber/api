/*
  Warnings:

  - You are about to drop the column `is_available` on the `services` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "is_available",
ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT false;
