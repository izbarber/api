/*
  Warnings:

  - Changed the type of `day_of_week` on the `barber_schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "barber_schedules" DROP COLUMN "day_of_week",
ADD COLUMN     "day_of_week" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "DayOfWeek";
