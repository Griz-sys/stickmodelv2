-- AlterTable: add notes column to projects (if it doesn't exist)
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- CreateTable
CREATE TABLE "project_steps" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "userLabel" TEXT NOT NULL,
    "userFileName" TEXT,
    "userFileUrl" TEXT,
    "userFileSize" INTEGER,
    "userFileType" TEXT,
    "adminFileName" TEXT,
    "adminFileUrl" TEXT,
    "adminFileSize" INTEGER,
    "adminFileType" TEXT,
    "cost" DOUBLE PRECISION,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "datePayment" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_steps_projectId_idx" ON "project_steps"("projectId");

-- AddForeignKey
ALTER TABLE "project_steps" ADD CONSTRAINT "project_steps_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
