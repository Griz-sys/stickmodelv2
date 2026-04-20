# StickModel Production Setup - Complete Guide

**Last Updated:** April 20, 2026  
**Status:** ✅ Production Ready

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    stickmodel.com (167.172.143.13)          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             Nginx Reverse Proxy (Port 443)           │  │
│  │  - HTTPS/SSL (Let's Encrypt Certificate)            │  │
│  │  - Security Headers (HSTS, X-Frame-Options, etc)    │  │
│  │  - HTTP → HTTPS Redirect                             │  │
│  │  - Gzip Compression                                  │  │
│  │  - Cache Control                                     │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │ (Proxy Pass to Port 3000)                │
│  ┌──────────────▼───────────────────────────────────────┐  │
│  │       Node.js/Next.js App (Port 3000)                │  │
│  │  - Environment: Production                           │  │
│  │  - Health Checks: Enabled                            │  │
│  │  - Auto-Restart: Yes (unless-stopped)               │  │
│  │  - Image: ghcr.io/griz-sys/stickmodel:latest        │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                          │
│  ┌──────────────▼───────────────────────────────────────┐  │
│  │    PostgreSQL Database (DigitalOcean Managed)        │  │
│  │  - Connection via DATABASE_URL in .env              │  │
│  │  - Prisma ORM (v5.22.0)                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

External Services:
├─ Zepto Mail (Email API) → zeptomail.in
├─ DigitalOcean Spaces (File Storage)
├─ PayPal (Payment Processing)
├─ Vercel Blob (Backup Storage)
└─ GitHub Container Registry (Docker Images)
```

---

## Current Setup Details

### Domain & SSL

- **Domain:** stickmodel.com (with www.stickmodel.com)
- **SSL Certificate:** Let's Encrypt (auto-renewed 30 days before expiration)
- **Certificate Location:** `/etc/letsencrypt/live/stickmodel.com/`
  - `fullchain.pem` (public certificate)
  - `privkey.pem` (private key)
- **Certificate Renewal:** Automatic via `systemctl` timer
- **Expiration:** Check with: `openssl x509 -in /etc/letsencrypt/live/stickmodel.com/fullchain.pem -noout -dates`

### Droplet Information

- **IP Address:** 167.172.143.13
- **OS:** Ubuntu (Linux)
- **Docker:** Installed and running
- **Docker Compose:** Version 2.x

### Database

- **Type:** PostgreSQL (DigitalOcean Managed)
- **Connection:** Private cluster endpoint
- **ORM:** Prisma (schema: `prisma/schema.prisma`)
- **Migrations:** Auto-run via Prisma

### Docker Setup

- **Image Registry:** GitHub Container Registry (GHCR)
- **Image Name:** `ghcr.io/griz-sys/stickmodel:latest`
- **Base Image:** `node:20-bullseye` (Debian 11 - has libssl1.1 for Prisma compatibility)
- **Multi-Stage Build:** Builder stage for compilation, minimal production stage
- **File Upload Limit:** 20GB (nginx client_max_body_size)

### Containers Running

1. **stickmodel** - Node.js/Next.js application on port 3000
2. **stickmodel-nginx** - Reverse proxy on ports 80/443

---

## Email & SSL Certificate Benefits

### Why SSL Certificate Helps with Email Deliverability

1. **SPF/DKIM/DMARC Alignment:**
   - Your domain (stickmodel.com) has SSL
   - Email service (Zepto Mail) sends "from" noreply@stickmodel.com
   - Gmail, Outlook, etc. verify domain ownership via HTTPS

2. **Trust Score:**
   - HTTPS sites get higher email deliverability scores
   - ISPs see stickmodel.com as legitimate
   - Reduces spam folder placement

3. **Security Headers:**
   - `Strict-Transport-Security` (HSTS) - Forces HTTPS
   - Proves you maintain security standards
   - Email providers trust your domain more

4. **Current Email Config:**
   - **API:** Zepto Mail (zeptomail.in endpoint)
   - **From Email:** noreply@stickmodel.com
   - **Recipients:** Specified in ADMIN_EMAIL_RECIPIENTS env var
   - **Headers:** Includes Reply-To and proper HTML formatting

### Email Setup Verification

```bash
# Check email configuration in .env
ssh root@167.172.143.13
cd /var/www/stickmodel
cat .env | grep -i "mail\|email"

# Should show:
# ZEPTO_MAIL_API_KEY=Zoho-enczapikey...
# ZEPTO_MAIL_FROM_EMAIL=noreply@stickmodel.com
# ADMIN_EMAIL_RECIPIENTS=...@...,...@...
```

---

## How to Update the Application

### Scenario 1: Update Code & Deploy

```bash
# Step 1: On your LOCAL MACHINE, make code changes
cd c:\Users\Aryan\Desktop\WORK\Stick Model\stickmodel
git add .
git commit -m "Feature: add new feature"
git push origin main

# Step 2: Build and push Docker image
docker compose build --no-cache
docker tag stickmodel-stickmodel:latest ghcr.io/griz-sys/stickmodel:latest
docker push ghcr.io/griz-sys/stickmodel:latest

# Step 3: On DROPLET, pull and restart
ssh root@167.172.143.13
cd /var/www/stickmodel
docker compose pull
docker compose up -d
docker compose logs -f stickmodel
```

**Alternative (using the helper script):**

```bash
# On local machine
bash docker-push.sh griz-sys

# On droplet
cd /var/www/stickmodel
docker compose pull
docker compose up -d
```

### Scenario 2: Update Environment Variables (.env)

```bash
# Step 1: SSH to droplet
ssh root@167.172.143.13

# Step 2: Edit .env file
cd /var/www/stickmodel
nano .env

# Step 3: Make your changes (arrow keys to navigate)
# Press Ctrl+X, then Y, then Enter to save

# Step 4: Restart containers to apply changes
docker compose restart stickmodel

# Step 5: Verify changes took effect
docker compose logs -f stickmodel
```

**IMPORTANT ENV VARIABLES:**

```bash
# Database (DO NOT CHANGE without coordination)
DATABASE_URL="postgresql://doadmin:PASSWORD@db-host:25060/defaultdb?sslmode=require"

# Security (KEEP SECRET)
JWT_SECRET="your-secret-key-here"

# Email (For contact form delivery)
ZEPTO_MAIL_API_KEY="Zoho-enczapikey YOUR_KEY"
ZEPTO_MAIL_FROM_EMAIL="noreply@stickmodel.com"
ADMIN_EMAIL_RECIPIENTS="aryan@vecube.club,other@example.com"

# File Storage
DO_SPACES_BUCKET="stickmodel"
DO_SPACES_ACCESS_KEY_ID="YOUR_KEY"
DO_SPACES_SECRET_ACCESS_KEY="YOUR_KEY"

# URLs (IMPORTANT: Must be HTTPS in production)
NEXT_PUBLIC_APP_URL="https://stickmodel.com"

# Payment
PAYPAL_ENV="production"
PAYPAL_CLIENT_ID="YOUR_ID"
PAYPAL_SECRET="YOUR_SECRET"

# Node Environment
NODE_ENV="production"
```

---

## Common Commands on Droplet

```bash
# SSH into droplet
ssh root@167.172.143.13

# Navigate to project
cd /var/www/stickmodel

# View running containers
docker compose ps

# View application logs (real-time)
docker compose logs -f stickmodel

# View nginx logs
docker compose logs -f nginx

# View all logs at once
docker compose logs -f

# Stop all containers
docker compose down

# Start containers
docker compose up -d

# Restart specific service
docker compose restart stickmodel  # or 'nginx'

# Execute command inside container
docker compose exec stickmodel sh

# Check disk space
df -h

# Check memory usage
free -h

# View SSL certificate expiration
openssl x509 -in /etc/letsencrypt/live/stickmodel.com/fullchain.pem -noout -dates

# Test HTTPS locally
curl https://stickmodel.com

# Force container rebuild
docker compose build --no-cache
docker compose up -d
```

---

## Troubleshooting

### Issue: App not responding

```bash
# 1. Check container status
docker compose ps

# 2. View logs
docker compose logs stickmodel

# 3. Check if it's a database connection issue
docker compose exec stickmodel sh
# Inside container:
psql $DATABASE_URL -c "SELECT 1;"

# 4. Restart
docker compose restart stickmodel
```

### Issue: HTTPS not working

```bash
# 1. Check certificate exists
ls -la /etc/letsencrypt/live/stickmodel.com/

# 2. Check nginx config
docker compose logs -f nginx

# 3. Validate nginx config syntax
docker compose exec nginx nginx -t

# 4. Restart nginx
docker compose restart nginx
```

### Issue: Emails not sending

```bash
# 1. Check email config in .env
cat .env | grep -i mail

# 2. Check logs for errors
docker compose logs stickmodel | grep -i "zepto\|mail\|error"

# 3. Verify ZEPTO_MAIL_API_KEY is correct
# Go to your Zoho console and verify the key starts with "Zoho-enczapikey "
```

### Issue: Out of disk space

```bash
# Check usage
df -h

# Clean up old Docker images
docker image prune -a

# Clean up dangling volumes
docker volume prune

# View largest directories
du -sh /var/www/stickmodel/*
```

### Issue: Port 80/443 already in use

```bash
# Find what's using the port
lsof -i :80
lsof -i :443

# Kill the process
kill -9 PID_NUMBER

# Or restart Docker
docker compose down
docker compose up -d
```

---

## Monitoring & Maintenance

### Daily Checks

```bash
# Check all containers are running
docker compose ps

# Check health status
docker compose exec stickmodel curl -f http://localhost:3000/health || echo "Unhealthy"
```

### Weekly Checks

```bash
# Check certificate renewal status
systemctl status certbot.timer

# Review logs for errors
docker compose logs stickmodel | tail -100
```

### Monthly Checks

```bash
# Check certificate expiration (renewal should happen at 30 days before)
openssl x509 -in /etc/letsencrypt/live/stickmodel.com/fullchain.pem -noout -dates

# Verify disk space is adequate
df -h /

# Test certificate renewal (dry-run)
certbot renew --dry-run
```

---

## Backup & Disaster Recovery

### Database Backup

```bash
# DigitalOcean managed PostgreSQL has automatic daily backups
# Access them via DigitalOcean Console > Databases > stickmodel > Backups

# For manual backup:
ssh root@167.172.143.13
cd /var/www/stickmodel
docker compose exec stickmodel sh
psql $DATABASE_URL -c "\dt"  # List tables
pg_dump $DATABASE_URL > backup.sql  # Create dump
```

### Application Backup

```bash
# Entire project is version controlled in GitHub
git clone https://github.com/Griz-sys/stickmodelv2.git /var/www/stickmodel-backup

# Docker image is stored in GitHub Container Registry
# Can pull and redeploy anytime
```

---

## Performance Optimization

### Current Optimizations

1. **Gzip Compression** - HTML/CSS/JS compressed in transit
2. **Static File Caching** - 30-day cache for images, fonts, CSS, JS
3. **HTTP/2** - Multiplexing for faster loading
4. **Security Headers** - HSTS tells browsers to use HTTPS
5. **Health Checks** - Automatic restart if app becomes unhealthy
6. **Auto-Scaling** - Ready for multiple replicas if needed (edit docker-compose.yml)

### Monitor Performance

```bash
# Check container resource usage
docker stats stickmodel

# Check database query performance
docker compose exec stickmodel sh
# Inside container:
psql $DATABASE_URL
SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;
```

---

## Security Checklist

- [x] HTTPS enabled with Let's Encrypt
- [x] Security headers configured (HSTS, X-Frame-Options, etc)
- [x] Container runs as non-root user
- [x] Database credentials in .env (not in code)
- [x] API keys in .env (not in code)
- [x] Firewall configured (ports 80, 443, 22 open)
- [x] Auto-restart on crash enabled
- [x] Health checks enabled
- [x] Certificate auto-renewal enabled
- [ ] (Optional) Rate limiting on API endpoints
- [ ] (Optional) WAF (Web Application Firewall)
- [ ] (Optional) DDoS protection via Cloudflare

---

## Future Updates & Scaling

### To Scale Horizontally (Multiple Instances)

```yaml
# In docker-compose.yml, use docker swarm or kubernetes
# Or use DigitalOcean App Platform for auto-scaling
```

### To Add More Services

```bash
# Add new service to docker-compose.yml
# Example: Redis cache, worker queue, etc
nano docker-compose.yml
# Add service definition
docker compose up -d service_name
```

### To Update Nginx Config

```bash
# Edit nginx.conf locally
nano nginx.conf

# Push to git
git add nginx.conf
git commit -m "Update nginx configuration"
git push origin main

# On droplet
cd /var/www/stickmodel
git pull origin main
docker compose restart nginx
```

---

## Important Note for Future Maintenance

When making changes to the codebase:

1. **Always use Docker for local testing** to match production environment
2. **Test with** `docker compose build --no-cache` locally first
3. **Push to GHCR** before deploying to avoid rebuilding on droplet
4. **Keep `package-lock.json` out of git** or regenerate it in Docker
5. **Native modules** require fresh `npm install` in Docker (not `npm ci`)
6. **Environment variables** must be set in `/var/www/stickmodel/.env` on droplet
7. **Let's Encrypt certificates** auto-renew via `systemctl` (no manual intervention needed)

---

## File Structure on Droplet

```
/var/www/stickmodel/
├── .env                    # Environment variables (DO NOT COMMIT)
├── .git/                   # Git repository
├── .gitignore
├── docker-compose.yml      # Container orchestration
├── Dockerfile              # Multi-stage build config
├── nginx.conf              # Reverse proxy config
├── app/                    # Next.js application
├── prisma/
│   └── schema.prisma       # Database schema
├── package.json
├── package-lock.json
└── node_modules/           # NOT on droplet (in Docker image)

/etc/letsencrypt/live/stickmodel.com/
├── fullchain.pem           # SSL certificate (public)
└── privkey.pem             # SSL key (private)
```

---

## Contact & Support

- **GitHub Repo:** https://github.com/Griz-sys/stickmodelv2
- **Email:** aryan@vecube.club
- **Domain:** stickmodel.com
- **Droplet IP:** 167.172.143.13

---

## Version History

| Date       | Change                                 | Author       |
| ---------- | -------------------------------------- | ------------ |
| 2026-04-20 | Docker deployment + SSL setup complete | AI Assistant |
|            | - Migrated from PM2 to Docker Compose  |              |
|            | - Set up GHCR for image registry       |              |
|            | - Configured Let's Encrypt SSL         |              |
|            | - Added nginx reverse proxy            |              |
|            | - Set up auto-renewal                  |              |
