/*
  Warnings:

  - Added the required column `end_time` to the `barber_schedule_breaks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_tim` to the `barber_schedule_breaks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "barber_schedule_breaks" ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_tim" TIMESTAMP(3) NOT NULL;
