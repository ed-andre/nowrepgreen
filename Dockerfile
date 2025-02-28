FROM node:20-alpine AS base

# Install SQLite and required dependencies for Prisma
RUN apk add --no-cache openssl sqlite-dev

# Development dependencies stage
FROM base AS development-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Generate Prisma client
FROM development-dependencies-env AS prisma-env
COPY prisma ./prisma
RUN npx prisma generate

# Production dependencies stage
FROM base AS production-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Build stage
FROM prisma-env AS build-env
COPY . .
RUN npm run build

# Final stage
FROM base
WORKDIR /app

# Set default environment variables
ENV PORT="8080"
ENV NODE_ENV="production"
ENV DATABASE_URL="file:/data/sqlite.db"

# Add database CLI shortcut
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

# Copy necessary files
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=prisma-env /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/package.json /app/package.json

# Copy start script if you have one
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Copy Prisma schema for potential migrations
COPY --from=build-env /app/prisma /app/prisma

ENTRYPOINT ["./start.sh"]