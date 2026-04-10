#!/bin/bash
# Deploy StickModel to DigitalOcean Droplet
# Run this once on your Droplet: curl -sSL https://raw.githubusercontent.com/yourusername/stickmodel/main/scripts/deploy.sh | bash

set -e

echo "🚀 Installing StickModel on DigitalOcean Droplet..."

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Certbot (SSL certificates)
apt install -y certbot python3-certbot-nginx

# Clone repository
cd /home
rm -rf stickmodel || true
git clone https://github.com/yourusername/stickmodel.git
cd stickmodel/stickmodel

# Install dependencies
npm install

# Build the app
npm run build

# Create .env file (user will add their own values)
cat > .env << 'EOF'
# Database (from DigitalOcean)
DATABASE_URL="postgresql://user:password@host:25060/stickmodel?sslmode=require"

# Your secrets
JWT_SECRET="generate-with-openssl-rand-base64-32"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
ZEPTO_MAIL_API_KEY="your-zepto-key"
ZEPTO_MAIL_FROM_EMAIL="noreply@stickmodel.com"
ZEPTO_MAIL_TO_EMAIL="your-email@example.com"
ADMIN_EMAIL_RECIPIENTS="admin@example.com"
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_SECRET="your-paypal-secret"
PAYPAL_ENV="sandbox"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-public-client-id"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
EOF

# Start with PM2
pm2 start "npm start" --name "stickmodel"
pm2 startup
pm2 save

# Setup Nginx reverse proxy
cat > /etc/nginx/sites-available/stickmodel << 'EOF'
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable Nginx site
ln -sf /etc/nginx/sites-available/stickmodel /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "✅ StickModel deployed!"
echo "📝 Edit /home/stickmodel/stickmodel/.env with your credentials"
echo "🌐 Your app will be running at http://YOUR_DROPLET_IP"
echo "🔐 After setting domain: sudo certbot --nginx -d your-domain.com"
echo "📡 To deploy updates: cd /home/stickmodel/stickmodel && git pull && npm run build && pm2 restart stickmodel"
