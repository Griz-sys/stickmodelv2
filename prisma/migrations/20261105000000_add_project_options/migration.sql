-- AlterTable projects: optional add-ons chosen when the project is created
ALTER TABLE "projects" ADD COLUMN "options" TEXT[] DEFAULT ARRAY[]::TEXT[];
