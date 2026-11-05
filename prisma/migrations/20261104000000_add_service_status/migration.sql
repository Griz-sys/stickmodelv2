-- CreateTable service_status: single-row delivery status shown on client dashboard
CREATE TABLE "service_status" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "mode" TEXT NOT NULL DEFAULT 'standard',
    "resumeDate" TIMESTAMP(3),
    "waitDays" INTEGER,
    "customRate" TEXT,
    "note" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_status_pkey" PRIMARY KEY ("id")
);
