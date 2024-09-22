-- DropForeignKey
ALTER TABLE "barber_schedule_breaks" DROP CONSTRAINT "barber_schedule_breaks_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "barber_schedules" DROP CONSTRAINT "barber_schedules_barber_id_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_barbershop_id_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_barbershop_id_fkey";

-- DropForeignKey
ALTER TABLE "members" DROP CONSTRAINT "members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_barbershop_id_fkey";

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_barbershop_id_fkey" FOREIGN KEY ("barbershop_id") REFERENCES "barbershops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_barbershop_id_fkey" FOREIGN KEY ("barbershop_id") REFERENCES "barbershops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_barbershop_id_fkey" FOREIGN KEY ("barbershop_id") REFERENCES "barbershops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barber_schedules" ADD CONSTRAINT "barber_schedules_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barber_schedule_breaks" ADD CONSTRAINT "barber_schedule_breaks_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "barber_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
