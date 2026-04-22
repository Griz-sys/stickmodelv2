# Build stage
FROM node:20-bullseye AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema early (needed for postinstall)
COPY prisma ./prisma

# Delete package-lock.json to avoid Windows/Mac binary caching issues
# npm install will regenerate it for Linux
RUN rm -f package-lock.json && npm cache clean --force

# Install dependencies with fresh lock file generation
RUN npm install --force

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:20-bullseye

WORKDIR /app

# Install required system libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    libssl1.1 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Copy prisma schema
COPY prisma ./prisma

# Install production dependencies fresh in Linux environment
RUN npm install --only=production --no-save

# Copy built app from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Create non-root user for security
RUN useradd -m -u 1001 nextjs
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Run with dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
