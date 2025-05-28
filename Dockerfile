# -----------------------------
# 1. Dependencies Install Phase
# -----------------------------
FROM node:18-alpine AS deps
WORKDIR /app

# Copy lock files first to optimize cache
COPY package.json package-lock.json ./
COPY prisma ./prisma   # Required for prisma generate (postinstall)
RUN npm ci

# -----------------------------
# 2. Build Phase
# -----------------------------
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

RUN npm run build

# -----------------------------
# 3. Production Runtime
# -----------------------------
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only required output
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
