import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stickmodel.com' },
    update: {},
    create: {
      email: 'admin@stickmodel.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@stickmodel.com' },
    update: {},
    create: {
      email: 'user@stickmodel.com',
      name: 'Test User',
      password: userPassword,
      role: 'user',
    },
  });

  console.log('✅ Test user created:', user.email);

  console.log('\nSeed completed successfully!');
  console.log('\nLogin credentials:');
  console.log('Admin: admin@stickmodel.com / admin123');
  console.log('User:  user@stickmodel.com / user123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
