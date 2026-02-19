# Stage 1: Install dependencies and build
FROM node:22-bookworm-slim AS builder

WORKDIR /usr/src/app

# Install build dependencies for canvas and other native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including dev) to build the app
RUN npm ci

COPY . .

# Generate Prisma Client (needed for build if types are used)
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 2: Prepare production dependencies
FROM node:22-bookworm-slim AS prod-deps

WORKDIR /usr/src/app

# Install build dependencies again for native modules in prod deps
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

# Remove prepare script to prevent husky from running (since devDeps are missing)
RUN npm pkg delete scripts.prepare

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Generate Prisma Client for production runtime
RUN npx prisma generate

# Stage 3: Production runtime image
FROM node:22-bookworm-slim AS runner

WORKDIR /usr/src/app

ENV NODE_ENV production

# Install runtime libraries required by canvas and openssl
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libjpeg62-turbo \
    libgif7 \
    librsvg2-2 \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy required files from previous stages
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/scripts ./scripts
COPY --from=builder /usr/src/app/src/i18n ./src/i18n
COPY --from=builder /usr/src/app/prisma.config.js ./

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
