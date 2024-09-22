/*
  Warnings:

  - You are about to drop the column `category_id` on the `services` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_category_id_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "service_id" TEXT;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "category_id";

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
