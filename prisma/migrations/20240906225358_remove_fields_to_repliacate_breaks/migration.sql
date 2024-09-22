/*
  Warnings:

  - You are about to drop the column `repeat` on the `barber_schedule_breaks` table. All the data in the column will be lost.
  - You are about to drop the column `repeat_days` on the `barber_schedule_breaks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "barber_schedule_breaks" DROP COLUMN "repeat",
DROP COLUMN "repeat_days";
