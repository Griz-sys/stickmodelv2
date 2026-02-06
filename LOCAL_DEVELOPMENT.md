# 🏠 Local Development Setup

## Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database - Use local PostgreSQL or hosted service
DATABASE_URL="postgresql://user:password@localhost:5432/stickmodel"

# JWT Secret - Generate a random string
JWT_SECRET="your-random-secret-at-least-32-characters"

# Vercel Blob - See "Blob Storage Setup" below
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed test data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Options

### Option 1: Local PostgreSQL (Traditional)

**Install PostgreSQL:**

- macOS: `brew install postgresql`
- Windows: Download from [postgresql.org](https://www.postgresql.org/download/)
- Linux: `sudo apt-get install postgresql`

**Create Database:**

```bash
# Start PostgreSQL (if not running)
# macOS: brew services start postgresql

# Create database
createdb stickmodel

# Update .env
DATABASE_URL="postgresql://localhost:5432/stickmodel"
```

### Option 2: Neon (Cloud, Recommended)

1. Go to [neon.tech](https://neon.tech)
2. Sign up (free tier includes 10 GB)
3. Create a new project
4. Copy connection string
5. Paste in `.env` as `DATABASE_URL`

**Pros:**

- No local installation needed
- Free tier generous
- Automatic backups
- Same as production

### Option 3: Supabase (Cloud)

1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Get connection string from Settings → Database
4. Use "Direct connection" (not pooled)
5. Update `.env`

### Option 4: Docker PostgreSQL

```bash
docker run --name stickmodel-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=stickmodel \
  -p 5432:5432 \
  -d postgres:15

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/stickmodel"
```

## Blob Storage Setup

File uploads require Vercel Blob storage token.

### Option 1: Connect to Vercel (Recommended)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Login:

```bash
vercel login
```

3. Link project:

```bash
vercel link
# Follow prompts to create/link project
```

4. Create Blob Storage:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project
   - Storage tab → Create Database → Blob
   - Copy `BLOB_READ_WRITE_TOKEN`
   - Add to `.env`

5. Pull environment variables:

```bash
vercel env pull .env.local
```

### Option 2: Manual Token (Alternative)

1. Go to Vercel Dashboard
2. Create a new project (or use existing)
3. Go to Storage → Create → Blob
4. Copy the token shown
5. Add to `.env`:

```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"
```

### Option 3: Development Without Blob (Limited)

For testing UI without file uploads:

- Leave `BLOB_READ_WRITE_TOKEN` empty
- App will start but file uploads won't work
- Good for testing other features

## Development Workflow

### Daily Development

```bash
# Start dev server
npm run dev

# In another terminal, watch database with Prisma Studio
npx prisma studio
```

### Making Database Changes

```bash
# 1. Edit prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name description_of_change

# 3. Prisma Client auto-regenerates
```

### Resetting Database

```bash
# WARNING: This deletes all data!
npx prisma migrate reset

# Recreates database and runs seed
```

### Testing as Different Users

Default accounts after seeding:

**Admin:**

- Email: `admin@stickmodel.com`
- Password: `admin123`

**Regular User:**

- Email: `user@stickmodel.com`
- Password: `user123`

**Create more users:**

```bash
npx prisma studio
# Add users in the UI
```

## Environment Variables Explained

| Variable                | Required | Description                       | Default                 |
| ----------------------- | -------- | --------------------------------- | ----------------------- |
| `DATABASE_URL`          | ✅       | PostgreSQL connection string      | -                       |
| `JWT_SECRET`            | ✅       | Secret for JWT tokens (32+ chars) | -                       |
| `BLOB_READ_WRITE_TOKEN` | ✅       | Vercel Blob storage token         | -                       |
| `NEXT_PUBLIC_APP_URL`   | ⚠️       | Your app URL                      | `http://localhost:3000` |

### Generating JWT_SECRET

```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use any random 32+ character string
```

## Common Development Issues

### Issue: "Can't reach database server"

**Solutions:**

- Check DATABASE_URL is correct
- Ensure PostgreSQL is running (if local)
- Test connection: `npx prisma db pull`

### Issue: "BLOB_READ_WRITE_TOKEN not found"

**Solutions:**

- Create Vercel Blob storage
- Copy token to `.env`
- Restart dev server

### Issue: Prisma errors

**Solutions:**

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset if needed
npx prisma migrate reset
```

### Issue: Port 3000 in use

**Solutions:**

```bash
# Use different port
PORT=3001 npm run dev

# Or kill process using port 3000
# macOS/Linux: lsof -ti:3000 | xargs kill
# Windows: netstat -ano | findstr :3000
```

### Issue: Auth not working

**Solutions:**

- Check JWT_SECRET is set
- Clear browser cookies
- Try incognito/private window

## Development Tools

### Prisma Studio (Database GUI)

```bash
npx prisma studio
# Opens at http://localhost:5555
```

### Useful Commands

```bash
# Check types
npm run build

# Lint code
npm run lint

# View database structure
npx prisma db pull

# Format Prisma schema
npx prisma format

# Seed database
npm run db:seed
```

## Project Structure

```
/app                    # Next.js app directory
  /page.tsx            # Hero/landing page
  /login               # Auth pages
  /home                # User dashboard (protected)
  /admin               # Admin dashboard (admin only)
  /api                 # API routes
    /auth              # Authentication endpoints
    /projects          # Project CRUD
    /submissions       # File management
    /blob              # Blob upload handler

/components            # React components
  /auth                # Auth-related components
  /ui                  # Reusable UI components

/lib                   # Utility functions
  auth.ts              # JWT authentication
  blob.ts              # Vercel Blob integration
  prisma.ts            # Database client
  utils.ts             # Helper functions

/prisma                # Database
  schema.prisma        # Database schema
  seed.ts              # Seed script

middleware.ts          # Route protection
```

## Testing Flows

### Test Admin Upload to User Project

1. Login as admin (`admin@stickmodel.com`)
2. Go to `/admin`
3. Click on a project
4. Click "Upload File"
5. Select file and upload
6. Logout and login as user
7. Verify user can see the file

### Test User Upload

1. Login as user (`user@stickmodel.com`)
2. Go to `/home`
3. Create or select project
4. Upload file
5. Verify file appears in submissions

## Performance Tips

### Speed Up Database Queries

- Add indexes in `schema.prisma`
- Use `include` wisely in queries
- Limit large datasets

### Optimize Development

- Use Turbopack: `npm run dev --turbo`
- Clear Next.js cache: `rm -rf .next`
- Use React DevTools for debugging

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Description"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request on GitHub
```

## Environment Tips

### Use Multiple .env Files

```bash
.env              # Main (gitignored)
.env.local        # Local overrides (gitignored)
.env.example      # Template (committed)
.env.production   # Production vars (gitignored)
```

### Switch Between Environments

```bash
# Use local DB
export DATABASE_URL="postgresql://localhost:5432/stickmodel"
npm run dev

# Use production DB (read-only testing)
export DATABASE_URL="your-production-url"
npm run dev
```

## Next Steps

Once local development is working:

1. ✅ Test all features locally
2. ✅ Make necessary changes
3. ✅ Commit to git
4. ✅ Push to GitHub
5. ⏭️ Deploy to Vercel (see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md))

## Getting Help

- Check [QUICKSTART.md](./QUICKSTART.md) for quick reference
- See [SETUP.md](./SETUP.md) for detailed setup
- Review [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) before deploying

---

Happy coding! 🚀
