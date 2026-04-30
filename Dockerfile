# 1. BUILD 
# Use alpine here so 'apk' works and matches your runner environment
FROM node:24-alpine AS builder
# Install OpenSSL (Required for Prisma engine)
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm ci
# Copy source and generate Prisma client
COPY . .
RUN npx prisma generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# 2. RUNNER
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Only copy the essential files from the builder
COPY --from=builder /app/public ./public

# Fixed the permissions and paths
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]