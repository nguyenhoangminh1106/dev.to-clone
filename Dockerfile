# Install dependencies and generate Prisma client
FROM node:18-alpine AS deps

WORKDIR /app

# Copy only package files for caching
COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci

# Build the application
FROM node:18-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Set environment variables (for build-time usage)
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Create production image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]
