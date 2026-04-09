const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "isPaidInitial" BOOLEAN NOT NULL DEFAULT false`
    );
    console.log('Column "isPaidInitial" added (or already exists).');
  } catch (e) {
    console.error('Failed:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
