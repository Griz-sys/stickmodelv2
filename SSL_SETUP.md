# SSL/HTTPS Setup for StickModel

## Your Configuration
- **Domain:** stickmodel.com
- **Droplet IP:** 167.172.143.13
- **Email:** aryan@vecube.club

---

## Step 1: Open Firewall Ports

On your droplet, allow HTTP (80) and HTTPS (443) traffic:

```bash
# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow SSH (if not already allowed)
ufw allow 22/tcp

# Enable firewall
ufw enable

# Verify firewall rules
ufw status
```

---

## Step 2: Install Certbot and Generate SSL Certificate

```bash
# Update package manager
apt update

# Install certbot
apt install -y certbot

# Generate Let's Encrypt certificate
certbot certonly --standalone \
  -d stickmodel.com \
  -d www.stickmodel.com \
  --email aryan@vecube.club \
  --agree-tos \
  --non-interactive

# This will create certificates at:
# /etc/letsencrypt/live/stickmodel.com/fullchain.pem
# /etc/letsencrypt/live/stickmodel.com/privkey.pem
```

Verify the certificate was created:
```bash
ls -la /etc/letsencrypt/live/stickmodel.com/
```

You should see:
```
fullchain.pem  privkey.pem
```

---

## Step 3: Update Docker Compose

Pull the latest changes with updated docker-compose.yml:

```bash
cd /var/www/stickmodel
git pull origin main
```

This updates:
- `nginx.conf` → Points to `/etc/letsencrypt/live/stickmodel.com/`
- `docker-compose.yml` → Mounts `/etc/letsencrypt` as read-only

---

## Step 4: Restart Containers

```bash
# Stop current containers
docker compose down

# Start with SSL
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f nginx
```

---

## Step 5: Test HTTPS Access

```bash
# Test from droplet
curl https://stickmodel.com

# Should return HTML (no errors)
```

From your local machine, visit:
- https://stickmodel.com
- https://www.stickmodel.com

You should see your StickModel site with a green lock 🔒

---

## Step 6: Enable Auto-Renewal (Important!)

Let's Encrypt certificates expire after 90 days. Set up auto-renewal:

```bash
# Install certbot renewal timer
apt install -y certbot

# Enable automatic renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal (dry-run)
certbot renew --dry-run

# Check renewal status
systemctl status certbot.timer
```

The certificate will auto-renew 30 days before expiration.

---

## Troubleshooting

**Certificate not found error in nginx logs:**
```bash
# Check certificate exists
ls -la /etc/letsencrypt/live/stickmodel.com/

# Restart nginx to pick up certificate
docker compose restart nginx
```

**Port 80 already in use:**
```bash
# Kill existing processes
killall nginx
fuser -k 80/tcp

# Restart docker
docker compose restart
```

**Certbot renewal fails:**
```bash
# Manually trigger renewal
certbot renew --force-renewal

# Check logs
journalctl -u certbot.timer -n 50
```

**HTTPS connection refused:**
```bash
# Make sure firewall allows port 443
ufw allow 443/tcp
ufw reload

# Restart containers
docker compose restart
```

---

## Security Headers (Already Configured)

Your nginx.conf includes security headers:
- **HSTS** - Forces HTTPS for 1 year
- **X-Frame-Options** - Prevents clickjacking
- **X-Content-Type-Options** - Prevents MIME sniffing
- **X-XSS-Protection** - Protects against XSS attacks

---

## Certificate Info

View your certificate details:

```bash
# Check certificate expiration
openssl x509 -in /etc/letsencrypt/live/stickmodel.com/fullchain.pem -noout -dates

# View full certificate info
openssl x509 -in /etc/letsencrypt/live/stickmodel.com/fullchain.pem -noout -text
```

---

## Production Checklist

- [ ] Firewall ports 80, 443 open
- [ ] SSL certificate generated with Let's Encrypt
- [ ] docker-compose.yml pointing to `/etc/letsencrypt`
- [ ] nginx.conf has correct certificate paths
- [ ] HTTPS works: https://stickmodel.com ✅
- [ ] HTTP redirects to HTTPS ✅
- [ ] Auto-renewal enabled ✅
- [ ] Security headers present ✅

---

## Next Steps

Once HTTPS is working:
1. Update `NEXT_PUBLIC_APP_URL` in .env to `https://stickmodel.com`
2. Update DNS if needed (should already be set in DigitalOcean)
3. Monitor certificate renewal in logs
