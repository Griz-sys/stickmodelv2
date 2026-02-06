# StickModel - Quick Reference Guide

## 🚀 Getting Started Checklist

1. ✅ Install dependencies: `npm install`
2. ✅ Copy `.env.example` to `.env` and fill in values
3. ✅ Set up PostgreSQL database
4. ✅ Run migrations: `npx prisma migrate dev`
5. ✅ Seed database: `npm run db:seed`
6. ✅ Set up AWS S3 bucket
7. ✅ Start dev server: `npm run dev`

## 🔑 Default Login Credentials

**Admin:** admin@stickmodel.com / admin123  
**User:** user@stickmodel.com / user123

## 📋 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create & apply migration
npx prisma studio        # Open database GUI
npm run db:seed          # Seed test users

# Utilities
npm run lint             # Lint code
```

## 🌐 Application Routes

### Public Routes

- `/` - Hero/Landing page
- `/login` - Login & Signup page
- `/about` - About page
- `/pricing` - Pricing page
- `/contact` - Contact page

### Protected Routes (Requires Login)

- `/home` - User dashboard
- `/requests/[id]` - Project details

### Admin Routes (Requires Admin Role)

- `/admin` - Admin dashboard

## 🔌 API Endpoints Quick Reference

### Authentication

```
POST   /api/auth/login       # Login
POST   /api/auth/signup      # Register
POST   /api/auth/logout      # Logout
GET    /api/auth/me          # Get current user
```

### Projects

```
GET    /api/projects         # List projects
POST   /api/projects         # Create project
GET    /api/projects/[id]    # Get project
PATCH  /api/projects/[id]    # Update (admin)
DELETE /api/projects/[id]    # Delete (admin)
```

### Submissions

```
POST   /api/submissions      # Create & get upload URL
GET    /api/submissions      # List submissions
GET    /api/submissions/[id]/download  # Get download URL
```

### Admin

```
GET    /api/admin/users      # List all users (admin)
```

## 📦 Environment Variables

```env
# Required
DATABASE_URL=             # PostgreSQL connection string
JWT_SECRET=               # Secret for JWT tokens
AWS_REGION=               # AWS region (e.g., us-east-1)
AWS_ACCESS_KEY_ID=        # AWS access key
AWS_SECRET_ACCESS_KEY=    # AWS secret key
AWS_S3_BUCKET=            # S3 bucket name

# Optional
NEXT_PUBLIC_APP_URL=      # App URL (default: http://localhost:3000)
```

## 🗄️ Database Models

### User

- id, name, email, password, role
- Relations: projects[], submissions[]

### Project

- id, name, tonnage, cost, status
- dateUpload, dateFinish, datePayment
- downloadLink, uploadLink, gifUrl
- userId (FK to User)
- Relations: user, submissions[]

### Submission

- id, fileName, fileSize, fileType
- s3Key, uploadedBy, uploaderId
- projectId (FK to Project)
- userId (FK to User)
- Relations: project, user

## 🔐 Authentication Flow

1. User logs in → JWT created
2. JWT stored in httpOnly cookie
3. Middleware checks token on protected routes
4. Token contains: id, email, name, role

## 📤 File Upload Process

1. Client POSTs to `/api/submissions` with metadata
2. Server generates S3 signed URL (1 hour expiry)
3. Client uploads directly to S3 using signed URL
4. Submission metadata saved in database

## 🛠️ Troubleshooting

### Can't connect to database

```bash
# Check Prisma can connect
npx prisma db pull

# Reset if needed
npx prisma migrate reset
```

### Authentication not working

- Check JWT_SECRET is set
- Clear cookies and try again
- Verify middleware.ts is correct

### File upload failing

- Verify AWS credentials
- Check S3 bucket exists
- Ensure bucket permissions are correct
- Check bucket region matches AWS_REGION

### Prisma errors

```bash
# Regenerate client
npx prisma generate

# Sync database
npx prisma db push
```

## 🎨 UI Component Usage

### Button

```tsx
<Button onClick={handleClick}>Click me</Button>
<Button variant="outline">Outline</Button>
```

### Card

```tsx
<Card>
  <CardContent>Content here</CardContent>
</Card>
```

### Modal

```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Title">
  Content here
</Modal>
```

### StatusBadge

```tsx
<StatusBadge status="uploaded" />
<StatusBadge status="finished" />
```

## 🔒 Security Best Practices

1. **Never commit `.env`** - It's in .gitignore
2. **Use strong JWT_SECRET** - Generate with openssl
3. **Change default passwords** - After seeding
4. **Use HTTPS in production** - Always
5. **Keep dependencies updated** - Run npm audit
6. **Limit S3 permissions** - Use IAM policies
7. **Enable rate limiting** - In production
8. **Monitor logs** - Set up error tracking

## 📊 Admin Capabilities

Admins can:

- ✅ View all users and projects
- ✅ Update project status (uploaded → finished)
- ✅ Upload files to any project
- ✅ Download all submissions
- ✅ View all submissions for any project
- ✅ Access admin dashboard at `/admin`

## 🚀 Production Deployment

1. Build the app: `npm run build`
2. Set up PostgreSQL (managed service)
3. Run migrations: `npx prisma migrate deploy`
4. Seed if needed: `npm run db:seed`
5. Configure environment variables
6. Deploy to Vercel/AWS/etc.
7. Set up monitoring and backups

## 📞 Need Help?

- Check [SETUP.md](./SETUP.md) for detailed setup
- Check [README.md](./README.md) for overview
- Review Prisma schema: `prisma/schema.prisma`
- Check middleware: `middleware.ts`
