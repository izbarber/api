/*
  Warnings:

  - You are about to drop the column `service_id` on the `users` table. All the data in the column will be lost.
  - Added the required column `service_id` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_service_id_fkey";

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "service_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "service_id";

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
