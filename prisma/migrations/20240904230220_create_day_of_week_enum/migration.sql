/*
  Warnings:

  - The `repeat_days` column on the `barber_schedule_breaks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `day_of_week` on the `barber_schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterTable
ALTER TABLE "barber_schedule_breaks" DROP COLUMN "repeat_days",
ADD COLUMN     "repeat_days" "DayOfWeek"[];

-- AlterTable
ALTER TABLE "barber_schedules" DROP COLUMN "day_of_week",
ADD COLUMN     "day_of_week" "DayOfWeek" NOT NULL;
