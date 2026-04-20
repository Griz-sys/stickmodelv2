# StickModel

A structural wireframe modeling service for efficient building design.

## Quick Links

- **Production Setup Guide:** [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) - Complete guide for understanding and maintaining the production deployment
- **GitHub Repository:** https://github.com/Griz-sys/stickmodelv2
- **Live Website:** https://stickmodel.com

## Architecture

- **Frontend/Backend:** Next.js 16 (React + Node.js)
- **Database:** PostgreSQL (DigitalOcean Managed)
- **Deployment:** Docker Compose on DigitalOcean Droplet
- **Images:** GitHub Container Registry (GHCR)
- **SSL:** Let's Encrypt with auto-renewal
- **Reverse Proxy:** Nginx with security headers

## For Developers/AI

Before making any changes or deployments, read [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) which includes:
- Complete architecture overview
- How to update code and deploy
- How to update environment variables
- SSL certificate and email configuration
- Troubleshooting guide
- Monitoring and maintenance procedures
- Security checklist
- All necessary commands

## Key Services

- Email: Zepto Mail API (zeptomail.in)
- File Storage: DigitalOcean Spaces
- Payment: PayPal
- Blob Storage: Vercel Blob
- Domain: stickmodel.com (167.172.143.13)

## Important Notes

1. Never commit `.env` file to git
2. Use Docker for all local testing
3. Always push Docker images to GHCR before deploying
4. Certificate auto-renews - no manual intervention needed
5. All commands and procedures are in PRODUCTION_SETUP.md
