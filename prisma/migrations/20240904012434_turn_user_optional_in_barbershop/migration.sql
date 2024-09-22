-- DropForeignKey
ALTER TABLE "barbershops" DROP CONSTRAINT "barbershops_user_id_fkey";

-- AlterTable
ALTER TABLE "barbershops" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "barbershops" ADD CONSTRAINT "barbershops_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
