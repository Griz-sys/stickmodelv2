# 🚀 Vercel Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- PostgreSQL database (Neon, Supabase, or Railway)

## Step 1: Prepare Your Database

### Option A: Neon (Recommended - Serverless Postgres)

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string (format: `postgresql://user:password@host/database`)
4. Save this for later

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (Direct connection, not pooled)
5. Save this for later

### Option C: Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the `DATABASE_URL` from variables
5. Save this for later

## Step 2: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Production ready"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/stickmodel.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1: Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Click "Import"

### 3.2: Configure Environment Variables

Before deploying, add these environment variables:

```env
DATABASE_URL=postgresql://your-connection-string-from-step1
JWT_SECRET=generate-with-openssl-rand-base64-32
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

To generate JWT_SECRET:

```bash
openssl rand -base64 32
```

### 3.3: Add Vercel Blob Storage

**Important:** Do this BEFORE first deployment!

1. In Vercel project dashboard, go to **Storage** tab
2. Click **Create Database**
3. Select **Blob**
4. Click **Create**
5. Copy the `BLOB_READ_WRITE_TOKEN` that appears
6. Add it to your Environment Variables:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
   ```

### 3.4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete (~2-3 minutes)

## Step 4: Run Database Migrations

After first deployment, you need to run migrations:

### Option A: Use Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migration command
vercel env pull .env.production
npx prisma migrate deploy
```

### Option B: Use Prisma Data Platform

1. Go to [cloud.prisma.io](https://cloud.prisma.io)
2. Connect your repository
3. Run migrations from dashboard

### Option C: Manual via Local Connection

```bash
# Set your production DATABASE_URL locally
export DATABASE_URL="your-production-connection-string"

# Run migrations
npx prisma migrate deploy
```

## Step 5: Seed Initial Data

Create admin user in production:

```bash
# Using Vercel CLI
vercel env pull .env.production
npm run db:seed
```

Or use Prisma Studio:

```bash
npx prisma studio
```

Create a user manually with:

- Email: `admin@yourdomain.com`
- Password: (hash with bcrypt, use online tool or run locally)
- Role: `admin`

## Step 6: Verify Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. You should see the hero/landing page
3. Click "Get Started" → should redirect to login
4. Try logging in with admin credentials

## Step 7: Configure Production Settings

### Update Environment Variable

```bash
NEXT_PUBLIC_APP_URL=https://your-actual-domain.vercel.app
```

### Enable Production Features

1. In Vercel dashboard, go to Settings → Domains
2. Add custom domain if desired
3. Enable automatic HTTPS (enabled by default)

## Environment Variables Reference

### Required Variables

| Variable                | Description                  | Where to Get                        |
| ----------------------- | ---------------------------- | ----------------------------------- |
| `DATABASE_URL`          | PostgreSQL connection string | Neon/Supabase/Railway               |
| `JWT_SECRET`            | Secret for JWT tokens        | Generate: `openssl rand -base64 32` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token    | Vercel Storage → Blob               |
| `NEXT_PUBLIC_APP_URL`   | Your app URL                 | Your Vercel deployment URL          |

### Setting Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add each variable for all environments (Production, Preview, Development)
3. Click "Save"
4. Redeploy for changes to take effect

## Common Issues & Solutions

### Issue: "Unauthorized" on login

**Solution:** Check that JWT_SECRET is set correctly in Vercel environment variables

### Issue: File uploads fail

**Solution:** Ensure BLOB_READ_WRITE_TOKEN is set. Create Blob storage if not done.

### Issue: Database connection fails

**Solution:**

- Check DATABASE_URL is correct
- For Neon: Use "pooled" connection string
- For Supabase: Use "Direct" connection string
- Ensure database allows connections from Vercel IPs (usually automatic)

### Issue: "Prisma Client not found"

**Solution:**

```bash
# In package.json, ensure postinstall script exists:
"scripts": {
  "postinstall": "prisma generate"
}
```

### Issue: Migrations not applied

**Solution:** Run migrations manually (see Step 4)

## Security Checklist

Before going live:

- [ ] Strong JWT_SECRET (32+ characters)
- [ ] Change default admin password
- [ ] DATABASE_URL uses SSL (`?sslmode=require`)
- [ ] BLOB_READ_WRITE_TOKEN kept secret
- [ ] CORS properly configured
- [ ] Rate limiting enabled (optional)
- [ ] Monitoring set up (Vercel Analytics)

## Continuous Deployment

Once set up, every push to `main` branch automatically:

1. Rebuilds the application
2. Runs type checking
3. Deploys to production

For feature branches:

- Push to any branch → Creates preview deployment
- Get unique URL for testing

## Monitoring & Logs

### View Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on a deployment → View logs

### Analytics

1. Enable Vercel Analytics in project settings
2. Monitor page views, performance, Web Vitals

## Backup Strategy

### Database Backups

- **Neon:** Automatic daily backups (free tier: 7 days retention)
- **Supabase:** Automatic daily backups (free tier: 7 days retention)
- **Railway:** Manual backups or use pg_dump

### Blob Storage Backups

- Vercel Blob has built-in redundancy
- Consider periodic exports for critical files

## Scaling Considerations

### Database

- Neon: Auto-scales, upgrade plan for more connections
- Supabase: Upgrade for more connections/storage
- Railway: Add more resources as needed

### Blob Storage

- Vercel Blob: Pay per GB stored and bandwidth
- First 500 MB free per month
- Monitor usage in Vercel dashboard

## Cost Breakdown (Approximate)

### Free Tier

- Vercel: Free (hobby plan)
- Neon: Free (1 GB storage)
- Vercel Blob: Free (500 MB storage)
- **Total: $0/month** for starting out

### Production (Low Traffic)

- Vercel: $20/month (Pro plan)
- Neon: $19/month (Pro plan, 10 GB)
- Vercel Blob: ~$10/month (5 GB storage + bandwidth)
- **Total: ~$50/month**

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Run migrations
3. ✅ Create admin user
4. ✅ Test login flow
5. ✅ Test file upload
6. ✅ Test admin dashboard
7. ⏭️ Add custom domain
8. ⏭️ Set up monitoring
9. ⏭️ Configure backups
10. ⏭️ Add team members

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)

## Rollback

If deployment fails:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Need Help?

Check the documentation files:

- [README.md](./README.md) - Project overview
- [SETUP.md](./SETUP.md) - Local setup
- [QUICKSTART.md](./QUICKSTART.md) - Quick reference

---

🎉 Your app is now production-ready and deployed!
