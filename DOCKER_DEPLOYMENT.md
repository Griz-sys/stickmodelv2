# Docker Deployment Guide for StickModel

## Step-by-Step Docker Setup on Digital Ocean Droplet

### STEP 1: Prepare Your Local Machine

1. **Commit and push all changes to git:**
```bash
cd /path/to/stickmodel
git add -A
git commit -m "Add Docker configuration"
git push origin main
```

---

### STEP 2: SSH into Your Droplet

```bash
ssh root@your_droplet_ip
```

Replace `your_droplet_ip` with your actual DigitalOcean droplet IP.

---

### STEP 3: Remove Old Deployment

If you have an existing deployment:

```bash
# Stop any running Node.js processes
pm2 stop all
pm2 delete all

# Or if using systemd
systemctl stop stickmodel 2>/dev/null || true
systemctl disable stickmodel 2>/dev/null || true

# Remove old project files (be careful!)
rm -rf /var/www/stickmodel
# OR if in different location:
rm -rf /path/to/your/stickmodel

# Remove old PM2 files
pm2 delete all
pm2 kill
```

---

### STEP 4: Install Docker & Docker Compose

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Add current user to docker group (optional, for non-root)
usermod -aG docker $USER

# Install Docker Compose
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Verify installation
docker --version
docker compose --version
```

---

### STEP 5: Clone Your Repository

```bash
# Create app directory
mkdir -p /var/www
cd /var/www

# Clone your repository
git clone https://github.com/your-username/stickmodel.git
cd stickmodel

# Or if using SSH key authentication:
# git clone git@github.com:your-username/stickmodel.git
# cd stickmodel

# Make sure you have the latest changes with updated Dockerfile
git pull origin main
```

---

### STEP 6: Create Environment File on Droplet

```bash
# Create .env file with your production values
nano .env
```

**Paste these with your actual values:**
```
DATABASE_URL="postgresql://doadmin:YOUR_PASSWORD@your-db-host:25060/defaultdb?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
ZEPTO_MAIL_API_KEY="Zoho-enczapikey YOUR_KEY"
ZEPTO_MAIL_FROM_EMAIL="noreply@stickmodel.com"
ZEPTO_MAIL_TO_EMAIL="shivansh@grizlabs.com"
ADMIN_EMAIL_RECIPIENTS="shivansh@grizlabs.com,ishank@grizlabs.com"
NEXT_PUBLIC_APP_URL="https://stickmodel.com"
DO_SPACES_ENDPOINT="https://stickmodel.sfo3.cdn.digitaloceanspaces.com"
DO_SPACES_S3_ENDPOINT="https://sfo3.digitaloceanspaces.com"
DO_SPACES_ACCESS_KEY_ID="YOUR_KEY"
DO_SPACES_SECRET_ACCESS_KEY="YOUR_KEY"
DO_SPACES_BUCKET="stickmodel"
DO_SPACES_REGION="sfo3"
PAYPAL_ENV="production"
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_SECRET="your-paypal-secret"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
NODE_ENV="production"
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

---

### STEP 7: Build and Push Docker Image (Recommended Approach)

**Option A: Push to GitHub Container Registry (GHCR) - Recommended**

First, authenticate with GHCR on your local machine:

```bash
# Create a GitHub Personal Access Token (if you haven't already):
# 1. Go to: https://github.com/settings/tokens
# 2. Create new classic token with 'write:packages' and 'read:packages' permissions
# 3. Copy the token

# Login to GHCR
echo YOUR_PERSONAL_ACCESS_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

Then build and push:

```bash
cd /path/to/stickmodel

# Option 1: Use the helper script
bash docker-push.sh griz-sys

# Option 2: Manual
docker compose build
docker tag stickmodel-stickmodel:latest ghcr.io/griz-sys/stickmodel:latest
docker tag stickmodel-stickmodel:latest ghcr.io/griz-sys/stickmodel:v1.0.0
docker push ghcr.io/griz-sys/stickmodel:latest
docker push ghcr.io/griz-sys/stickmodel:v1.0.0
```

Then on your droplet, update `docker-compose.yml`:

```yaml
services:
  stickmodel:
    image: ghcr.io/griz-sys/stickmodel:latest
```

Then on droplet:

```bash
cd /var/www/stickmodel

# Authenticate with GHCR (if private repo)
echo YOUR_PERSONAL_ACCESS_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Pull and start
docker compose pull
docker compose up -d
```

---

**Option B: Build directly on droplet (Slower, not recommended for production)**

```bash
cd /var/www/stickmodel

# Build the Docker image
docker compose build

# This will take a few minutes on first run
```

---

### STEP 8: Start the Application

```bash
# Start the containers
docker compose up -d

# Check if containers are running
docker compose ps

# View logs
docker compose logs -f stickmodel
```

Expected output like:
```
stickmodel  | > stickmodel@0.1.0 start
stickmodel  | > next start
stickmodel  | ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Press `Ctrl+C` to exit logs.

---

### STEP 9: Setup Nginx Reverse Proxy (Optional but Recommended)

**Update nginx.conf with your domain:**

```bash
nano /var/www/stickmodel/nginx.conf
```

Find and replace:
- `stickmodel.com www.stickmodel.com` with your actual domain
- `/etc/nginx/ssl/cert.pem` and `/etc/nginx/ssl/key.pem` paths

**For SSL certificates, use Let's Encrypt:**

```bash
apt install certbot python3-certbot-nginx
certbot certonly --standalone -d stickmodel.com -d www.stickmodel.com
```

**Update nginx.conf with actual certificate paths:**
```
ssl_certificate /etc/letsencrypt/live/stickmodel.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/stickmodel.com/privkey.pem;
```

**Restart nginx:**
```bash
docker compose restart nginx
```

---

### STEP 10: Verify Everything Works

```bash
# Check application is running
curl http://localhost:3000

# Should return HTML of your site

# Check through nginx
curl https://stickmodel.com
# (if SSL configured)

# View real-time logs
docker compose logs -f

# Check Docker stats
docker stats
```

---

### STEP 11: Setup Auto-Restart on Droplet Reboot

Docker containers with `restart: unless-stopped` will auto-restart. To verify:

```bash
# Test by restarting
docker compose restart

# Or test droplet reboot
reboot
```

After reboot, SSH back in and verify:
```bash
docker compose ps
```

---

## Useful Docker Commands

```bash
# Stop all containers
docker compose down

# Stop and remove all containers, networks
docker compose down -v

# View logs
docker compose logs -f stickmodel

# View specific service logs
docker compose logs -f nginx

# Rebuild image
docker compose build --no-cache

# SSH into container
docker compose exec stickmodel sh

# Check container resources
docker stats

# Remove unused images
docker image prune -a

# List all containers
docker ps -a

# List all images
docker images
```

---

## Updating Your Application

**Recommended Workflow (Using GHCR):**

1. **On your local machine, make changes and push:**
```bash
cd /path/to/stickmodel
git add -A
git commit -m "Update: description"
git push origin main
```

2. **Build and push to GHCR:**
```bash
# Login to GHCR (if not already logged in)
echo YOUR_PERSONAL_ACCESS_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Build image
docker compose build

# Tag it
docker tag stickmodel-stickmodel:latest ghcr.io/griz-sys/stickmodel:latest

# Push to registry
docker push ghcr.io/griz-sys/stickmodel:latest
```

Or use the script:
```bash
bash docker-push.sh griz-sys
```

3. **On droplet, pull and restart:**
```bash
cd /var/www/stickmodel

# Make sure docker-compose.yml has the right image reference:
# image: ghcr.io/griz-sys/stickmodel:latest

# If using private repo, login first
echo YOUR_PERSONAL_ACCESS_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Pull latest image
docker compose pull

# Restart with new image
docker compose up -d

# Check logs
docker compose logs -f
```

---

**Alternative: Rebuild on droplet (slower, not recommended):**

When you make changes locally:

```bash
# 1. Commit and push to git
git add -A
git commit -m "Update: description"
git push origin main

# 2. On droplet, pull latest changes
cd /var/www/stickmodel
git pull origin main

# 3. Rebuild and restart
docker compose build --no-cache
docker compose up -d

# 4. Check status
docker compose logs -f
```

---

## Troubleshooting

**Build fails with "EBADENGINE" warnings about Node version:**
```bash
# This means dependencies require Node 20+
# The Dockerfile has been updated to use Node 20-alpine
# Make sure you're using the latest version:
git pull origin main

# Then rebuild:
docker compose build --no-cache
docker compose up -d
```

**Build fails with "Prisma Schema not found":**
```bash
# Make sure prisma/schema.prisma exists in the project
ls -la prisma/schema.prisma

# The Dockerfile has been fixed to copy the prisma directory early
# Pull latest changes:
git pull origin main

# Rebuild:
docker compose build --no-cache
```

**Container keeps crashing:**
```bash
docker compose logs stickmodel
# Check the error message
```

**Port already in use:**
```bash
# Change port in docker-compose.yml
# ports:
#   - "3001:3000"  # Changed from 3000 to 3001
docker compose restart
```

**Database connection issues:**
```bash
# Verify DATABASE_URL in .env is correct
# Test connection from container
docker compose exec stickmodel psql $DATABASE_URL -c "SELECT 1"
```

**Out of disk space:**
```bash
# Clean up Docker
docker system prune -a

# Check disk usage
df -h
```

**Can't access from domain:**
```bash
# Check DNS records point to droplet IP
nslookup stickmodel.com

# Check firewall
ufw status
ufw allow 80
ufw allow 443
```

---

## Production Checklist

- [ ] Environment variables set correctly
- [ ] Database backups configured
- [ ] SSL certificate configured and auto-renewal setup
- [ ] Firewall rules configured
- [ ] Monitoring/alerts setup (optional)
- [ ] Log rotation configured (optional)
- [ ] Regular git pulls scheduled

---

## Monitoring (Optional)

Add monitoring to docker-compose.yml:

```yaml
  watchtower:
    image: containrrr/watchtower
    container_name: stickmodel-watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 3600 stickmodel  # Check for updates every hour
    networks:
      - stickmodel-network
```

This will auto-update your containers when new images are available.

---

## For Help

1. **Check logs:** `docker compose logs -f`
2. **Check status:** `docker compose ps`
3. **SSH into container:** `docker compose exec stickmodel sh`
4. **Check Docker documentation:** https://docs.docker.com/

