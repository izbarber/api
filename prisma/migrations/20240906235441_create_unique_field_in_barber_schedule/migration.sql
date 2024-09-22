/*
  Warnings:

  - A unique constraint covering the columns `[day_of_week,barber_id]` on the table `barber_schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "barber_schedules_day_of_week_barber_id_key" ON "barber_schedules"("day_of_week", "barber_id");
