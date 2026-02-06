# StickModel - Setup Guide

## Overview

This is a production-grade Next.js application with PostgreSQL database, AWS S3 file storage, and JWT-based authentication.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- AWS account with S3 bucket created
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL

1. Create a new PostgreSQL database:

```bash
createdb stickmodel
```

2. Update `.env` with your database connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/stickmodel?schema=public"
```

#### Option B: Hosted PostgreSQL (Recommended for Production)

Use services like:

- [Neon](https://neon.tech/) (Serverless Postgres - Free tier)
- [Supabase](https://supabase.com/) (Free tier available)
- [Railway](https://railway.app/)
- AWS RDS

Get the connection string from your provider and add it to `.env`.

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in the required values:

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/stickmodel?schema=public"

# JWT Secret (Required - generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Vercel Blob Storage (Required for file uploads)
# For local dev: Get from Vercel Dashboard after creating a Blob store
# For production: Automatically injected by Vercel
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token_from_vercel_storage"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Generating JWT Secret

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 4. Vercel Blob Setup (For File Uploads)

#### Option A: Local Development with Vercel Blob

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Link your project:

```bash
vercel link
```

4. Create Blob storage:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project (or create one)
   - Go to Storage tab → Create → Blob
   - Copy the `BLOB_READ_WRITE_TOKEN`
   - Add it to your `.env` file

#### Option B: Use Local File System (Development Only)

For local development without Vercel Blob, files will be stored temporarily. This is not recommended but works for testing the UI.

**Note:** File uploads will work in production once deployed to Vercel with Blob storage configured.

### 5. Database Migration

Run Prisma migrations to create the database schema:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Or create a new migration
npx prisma migrate dev --name init
```

### 6. Seed Initial Admin User (Optional)

Create a script to add an admin user:

```bash
# Create a seed script
npx prisma db seed
```

Or manually using Prisma Studio:

```bash
npx prisma studio
```

Then create a user with:

- Email: admin@stickmodel.com
- Password: (hashed using bcrypt)
- Role: admin

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses three main models:

### User

- id (UUID)
- name
- email (unique)
- password (hashed)
- role (user | admin)
- createdAt, updatedAt

### Project

- id (UUID)
- name
- tonnage
- dateUpload, dateFinish, datePayment
- cost
- downloadLink, uploadLink, gifUrl
- uploadedBy
- status (uploaded | finished)
- userId (foreign key)

### Submission

- id (UUID)
- projectId (foreign key)
- userId (foreign key)
- fileName, fileSize, fileType
- s3Key, s3Url
- uploadedBy (user | admin)
- uploaderId
- description
- createdAt

## Application Structure

```
/
├── app/
│   ├── page.tsx                    # Hero/Landing page (public)
│   ├── login/page.tsx              # Login/Signup page (public)
│   ├── home/page.tsx               # User dashboard (protected)
│   ├── admin/page.tsx              # Admin dashboard (admin only)
│   ├── api/
│   │   ├── auth/                   # Authentication endpoints
│   │   ├── projects/               # Project CRUD
│   │   ├── submissions/            # File submissions
│   │   └── admin/                  # Admin-only endpoints
│   └── layout.tsx                  # Root layout
├── components/
│   ├── auth/                       # Auth-related components
│   ├── ui/                         # Reusable UI components
│   └── upload/                     # File upload components
├── lib/
│   ├── auth.ts                     # JWT authentication
│   ├── prisma.ts                   # Prisma client
│   ├── s3.ts                       # S3 operations
│   └── utils.ts                    # Utility functions
├── prisma/
│   └── schema.prisma               # Database schema
└── middleware.ts                   # Route protection

```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Projects

- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project (admin)
- `DELETE /api/projects/[id]` - Delete project (admin)

### Submissions

- `POST /api/submissions` - Create submission & get upload URL
- `GET /api/submissions?projectId=xxx` - List submissions
- `GET /api/submissions/[id]/download` - Get download URL

### Admin

- `GET /api/admin/users` - List all users (admin only)

## Security Features

1. **JWT-based Authentication:** Secure token-based auth with httpOnly cookies
2. **Password Hashing:** bcrypt with salt rounds
3. **Role-based Access Control:** User and admin roles
4. **Protected Routes:** Middleware enforces authentication
5. **Signed S3 URLs:** Time-limited, secure file access
6. **SQL Injection Protection:** Prisma parameterized queries

## File Upload Flow

1. Client requests upload from `/api/submissions`
2. Server creates submission record and returns upload config
3. Client uploads directly to Vercel Blob using `@vercel/blob/client`
4. Client updates submission with blob URL
5. File metadata + URL stored in Postgres
6. Downloads use blob URLs directly (with access control)

## Deployment

### Database

- Deploy PostgreSQL to your preferred provider
- Run migrations: `npx prisma migrate deploy`

### Application

- Deploy to Vercel, AWS, or similar
- Set environment variables in deployment platform
- Ensure `JWT_SECRET` is strong and unique

### S3

- Ensure bucket has proper CORS configuration
- Keep bucket private, use signed URLs only

## Troubleshooting

### Database Connection Issues

- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure database exists

### S3 Upload Failures

- Verify AWS credentials
- Check bucket name and region
- Ensure IAM user has correct permissions

### Authentication Issues

- Clear cookies and try again
- Verify JWT_SECRET is set
- Check middleware configuration

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Prisma commands
npx prisma studio          # Open database GUI
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Create and apply migration
npx prisma migrate deploy  # Apply migrations in production
```

## Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use production PostgreSQL database
- [ ] Configure AWS S3 bucket properly
- [ ] Set up HTTPS/SSL
- [ ] Enable CORS correctly
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure rate limiting
- [ ] Set up backups for database
- [ ] Review and test security
- [ ] Set up CI/CD pipeline

## Support

For issues or questions, contact the development team or refer to:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
