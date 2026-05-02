# 1. BUILD 
FROM node:24-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
# Install dependencies first for better caching
RUN npm ci
# ALL source files now. 
COPY . .

# Arguments for Build-time validation
ARG DATABASE_URL
ARG JWT_SECRET
ARG NEXT_PUBLIC_SOCKET_PORT
ARG REDIS_URL
ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_SECRET
ARG CLOUDINARY_API_KEY
ARG SOCKET_HOST

# Map ARGs to ENVs
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV NEXT_PUBLIC_SOCKET_PORT=$NEXT_PUBLIC_SOCKET_PORT
ENV REDIS_URL=$REDIS_URL
ENV CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
ENV CLOUDINARY_SECRET=$CLOUDINARY_SECRET
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
ENV SOCKET_HOST=$SOCKET_HOST

# Generate Prisma and Build
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 2. RUNNER
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Standalone mode requires these specific paths
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD npx prisma migrate deploy && npm start
# CMD ["node", "server.js"]
LABEL org.opencontainers.image.source https://github.com/logic-gate-sys/ashesi-mentorship-platform