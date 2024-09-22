-- CreateTable
CREATE TABLE "barber_schedules" (
    "id" TEXT NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "start_tim" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "barber_id" TEXT NOT NULL,

    CONSTRAINT "barber_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barber_schedule_breaks" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "repeat" BOOLEAN NOT NULL DEFAULT false,
    "repeat_days" INTEGER[],
    "schedule_id" TEXT NOT NULL,

    CONSTRAINT "barber_schedule_breaks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "barber_schedules" ADD CONSTRAINT "barber_schedules_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barber_schedule_breaks" ADD CONSTRAINT "barber_schedule_breaks_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "barber_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
