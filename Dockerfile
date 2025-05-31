# Install dependencies with OpenSSL and sharp
FROM node:20-alpine3.20 AS deps

# Install necessary packages
RUN apk update && apk upgrade && apk add --no-cache openssl libc6-compat vips vips-dev

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci --omit=dev

# Install sharp with appropriate flags for Alpine
RUN npm install --omit=dev sharp

# Build app
FROM node:20-alpine3.20 AS build

# Install necessary packages
RUN apk update && apk upgrade && apk add --no-cache openssl libc6-compat vips vips-dev

WORKDIR /app

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Set environment variables
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

# Generate Prisma client and build the app
RUN npx prisma generate
RUN npm run build

# Final runtime image (standalone output)
FROM node:20-alpine3.20 AS runner

# Install necessary packages
RUN apk update && apk upgrade && apk add --no-cache openssl libc6-compat vips vips-dev

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PRISMA_ENABLE_TRACING=false
ENV NEXT_SHARP_PATH=/app/node_modules/sharp

# Copy built assets
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma

# Start the application
CMD ["node", "server.js"]
