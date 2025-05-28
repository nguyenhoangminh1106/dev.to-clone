# Install dependencies only
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build phase
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ADD THIS LINE to ensure prisma/schema.prisma exists
RUN if [ -f prisma/schema.prisma ]; then echo "✅ schema.prisma found"; else echo "❌ schema.prisma MISSING"; fi

RUN npm run build

# Production runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
