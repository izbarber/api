/*
  Warnings:

  - You are about to drop the column `start_tim` on the `barber_schedule_breaks` table. All the data in the column will be lost.
  - You are about to drop the column `start_tim` on the `barber_schedules` table. All the data in the column will be lost.
  - Added the required column `start_time` to the `barber_schedule_breaks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `barber_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "barber_schedule_breaks" DROP COLUMN "start_tim",
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "barber_schedules" DROP COLUMN "start_tim",
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationToken" TEXT;
