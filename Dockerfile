# Install dependencies with OpenSSL and sharp
FROM node:20-alpine3.20 AS deps

RUN apk update && apk upgrade && apk add --no-cache openssl libc6-compat libvips
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev
RUN npm install sharp --omit=dev

# Build app
FROM node:20-alpine3.20 AS build

RUN apk update && apk upgrade && apk add --no-cache openssl libc6-compat libvips
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

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

RUN npx prisma generate
RUN npm run build

# Final runtime image (standalone output)
FROM node:20-alpine3.20 AS runner

RUN apk update && apk upgrade && apk add --no-cache openssl libc6-compat libvips
WORKDIR /app

ENV NODE_ENV=production
ENV PRISMA_ENABLE_TRACING=false

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma

CMD ["node", "server.js"]
