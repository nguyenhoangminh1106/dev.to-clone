# -------------------------
# 1. Dependencies Stage
# -------------------------
FROM node:18-alpine AS deps

WORKDIR /app

# Add OpenSSL 1.1 support
RUN apk add --no-cache openssl1.1-compat

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci

# -------------------------
# 2. Build Stage
# -------------------------
FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl1.1-compat

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Build-time env vars
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET

ENV DATABASE_URL=$DATABASE_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# -------------------------
# 3. Runtime Stage
# -------------------------
FROM node:18-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl1.1-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
