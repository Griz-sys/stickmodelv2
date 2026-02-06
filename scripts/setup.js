#!/usr/bin/env node

/**
 * StickModel - Quick Setup Script
 * Run this after configuring your .env file
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏗️  StickModel Setup Script\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found!');
  console.log('📝 Please copy .env.example to .env and fill in your values:\n');
  console.log('   cp .env.example .env\n');
  process.exit(1);
}

// Check if .env has required values
const envContent = fs.readFileSync('.env', 'utf8');
const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_S3_BUCKET',
];

const missingVars = requiredVars.filter(varName => {
  const regex = new RegExp(`^${varName}=.+`, 'm');
  return !regex.test(envContent);
});

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:\n');
  missingVars.forEach(v => console.log(`   - ${v}`));
  console.log('\n📝 Please update your .env file\n');
  process.exit(1);
}

console.log('✅ Environment variables configured\n');

// Generate Prisma Client
console.log('📦 Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated\n');
} catch (error) {
  console.log('❌ Failed to generate Prisma Client');
  process.exit(1);
}

// Run migrations
console.log('🗄️  Running database migrations...');
try {
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log('✅ Database migrations complete\n');
} catch (error) {
  console.log('❌ Failed to run migrations');
  console.log('💡 Make sure your DATABASE_URL is correct and PostgreSQL is running');
  process.exit(1);
}

// Seed database
console.log('🌱 Seeding database with test users...');
try {
  execSync('npm run db:seed', { stdio: 'inherit' });
  console.log('✅ Database seeded\n');
} catch (error) {
  console.log('⚠️  Failed to seed database (not critical)');
  console.log('   You can seed manually later with: npm run db:seed\n');
}

console.log('🎉 Setup complete!\n');
console.log('📝 Next steps:');
console.log('   1. Start the dev server: npm run dev');
console.log('   2. Open http://localhost:3000');
console.log('   3. Login with:');
console.log('      - Admin: admin@stickmodel.com / admin123');
console.log('      - User:  user@stickmodel.com / user123\n');
console.log('📖 For more info, check:');
console.log('   - README.md - Project overview');
console.log('   - SETUP.md - Detailed setup guide');
console.log('   - QUICKSTART.md - Quick reference\n');
