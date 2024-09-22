-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_service_id_fkey";

-- AlterTable
ALTER TABLE "members" ALTER COLUMN "service_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
