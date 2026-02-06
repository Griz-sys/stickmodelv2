-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tonnage" INTEGER,
    "dateUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateFinish" TIMESTAMP(3),
    "datePayment" TIMESTAMP(3),
    "cost" DOUBLE PRECISION,
    "downloadLink" TEXT,
    "uploadLink" TEXT,
    "videoUrl" TEXT,
    "uploadedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'uploaded',
    "userId" TEXT,
    "userFileName" TEXT,
    "userFileUrl" TEXT,
    "userFileSize" INTEGER,
    "userFileType" TEXT,
    "adminFileName" TEXT,
    "adminFileUrl" TEXT,
    "adminFileSize" INTEGER,
    "adminFileType" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "projects_userId_idx" ON "projects"("userId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_dateUpload_idx" ON "projects"("dateUpload");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
