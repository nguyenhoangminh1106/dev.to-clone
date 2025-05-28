# -----------------------------
# 1. Dependencies Install Phase
# -----------------------------
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files and the prisma folder for prisma generate
COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci

# -----------------------------
# 2. Build Phase
# -----------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies and prisma folder from deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy the rest of the application source code
COPY . .

# Build the Next.js app
RUN npm run build

# -----------------------------
# 3. Production Runtime
# -----------------------------
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy production dependencies, static assets, and prisma folder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
