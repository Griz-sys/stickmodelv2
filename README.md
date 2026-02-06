# 🏗️ StickModel - Production-Grade Structural Modeling Platform

A modern, full-stack web application for transforming structural drawings into professional stick models. Built with Next.js 16, PostgreSQL, AWS S3, and JWT authentication.

## ✨ Features

### For Users

- 🎨 **Beautiful Hero/Landing Page** - Professional landing page with smooth animations
- 🔐 **Secure Authentication** - JWT-based auth with email/password
- 📁 **Project Management** - Create, track, and manage modeling projects
- 📤 **File Upload/Download** - Direct S3 uploads with signed URLs
- 📊 **Project Tracking** - Real-time status updates (uploaded, processing, ready, etc.)
- 💰 **Transparent Pricing** - Clear project cost tracking

### For Admins

- 👥 **User Management** - View all users and their projects
- 📋 **Project Oversight** - View and manage all projects
- ✅ **Status Updates** - Update project status (uploaded → finished)
- 📤 **Admin Uploads** - Upload files directly to user projects
- 🔄 **Submission Tracking** - Two-way file exchange system
- 📊 **Dashboard Analytics** - Real-time stats and metrics

## 🏗️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern styling
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful iconography

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Production-grade relational database
- **JWT (jose)** - Secure authentication
- **bcryptjs** - Password hashing

### Storage & Infrastructure

- **AWS S3** - Secure file storage
- **Signed URLs** - Direct client-to-S3 uploads
- **Database Migrations** - Version-controlled schema

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd stickmodel
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/stickmodel"
JWT_SECRET="your-secret-key"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="your-bucket-name"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed initial users
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Default Credentials

After seeding the database:

**Admin Account:**

- Email: `admin@stickmodel.com`
- Password: `admin123`

**Test User Account:**

- Email: `user@stickmodel.com`
- Password: `user123`

⚠️ **Change these in production!**

## 📚 Database Schema

### User Model

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("user") // user | admin
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Project Model (Exact Match Required)

```prisma
model Project {
  id           String    @id @default(uuid())
  name         String
  tonnage      Int?
  dateUpload   DateTime  @default(now())
  dateFinish   DateTime?
  datePayment  DateTime?
  cost         Float?
  downloadLink String?
  uploadLink   String?
  gifUrl       String?
  uploadedBy   String?
  status       String    @default("uploaded") // uploaded, finished
  userId       String?
}
```

### Submission Model

```prisma
model Submission {
  id          String   @id @default(uuid())
  projectId   String
  userId      String
  fileName    String
  fileSize    Int
  fileType    String
  s3Key       String
  uploadedBy  String   // "user" | "admin"
  uploaderId  String
  description String?
  createdAt   DateTime @default(now())
}
```

## 🔐 Authentication Flow

1. User visits hero page (public)
2. Clicks "Get Started" → redirected to `/login`
3. User logs in or signs up
4. JWT token stored in httpOnly cookie
5. Redirected to `/home` (protected)
6. Middleware verifies token on all protected routes
7. Admin users have access to `/admin` route

## 📤 File Upload Flow

1. **Client requests upload:**
   - POST `/api/submissions` with file metadata
2. **Server generates signed URL:**
   - Creates S3 key: `uploads/{userId}/{projectId}/{timestamp}-{filename}`
   - Generates time-limited signed URL (1 hour)
   - Creates submission record in database
3. **Client uploads directly to S3:**
   - Uses signed URL to PUT file to S3
   - No file data passes through server
4. **Download:**
   - GET `/api/submissions/{id}/download`
   - Server generates signed download URL
   - Client downloads directly from S3

## 🛡️ Security Features

- ✅ JWT-based authentication with httpOnly cookies
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Role-based access control (user/admin)
- ✅ Protected API routes with middleware
- ✅ Signed S3 URLs (time-limited access)
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (React escaping)
- ✅ CSRF protection (SameSite cookies)

## 🌐 API Endpoints

### Public Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Protected Endpoints

- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project details
- `POST /api/submissions` - Create submission & get upload URL
- `GET /api/submissions` - List submissions
- `GET /api/submissions/[id]/download` - Get download URL

### Admin-Only Endpoints

- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `GET /api/admin/users` - List all users

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Lint code
npm run db:seed      # Seed database with test users
```

## 🎨 UI Components

All components are in `components/ui/`:

- `Button` - Customizable button with variants
- `Card` - Card container with content
- `Input` - Form input field
- `Textarea` - Multi-line text input
- `Badge` - Status badge with colors
- `Modal` - Overlay modal dialog
- `Checkbox` - Checkbox input
- `Dropzone` - File upload dropzone

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Deploy Database

Use managed PostgreSQL:

- [Supabase](https://supabase.com/) (Free tier)
- [Neon](https://neon.tech/) (Serverless)
- [Railway](https://railway.app/)
- AWS RDS

### Configure S3

1. Create S3 bucket
2. Create IAM user with S3 access
3. Add credentials to environment
4. Configure CORS if needed

## 🐛 Troubleshooting

### Database Connection

```bash
# Test connection
npx prisma db pull
```

### Prisma Issues

```bash
# Reset database (⚠️ deletes data)
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### S3 Upload Issues

- Verify AWS credentials
- Check bucket permissions
- Ensure correct region

## 📄 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [Prisma Schema](./prisma/schema.prisma) - Database schema

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

Built with ❤️ using Next.js, PostgreSQL, and AWS S3
