# Usar Node.js 20 Alpine 3.18 como imagen base
FROM node:20-alpine AS base

# Instalar dependencias necesarias para canvas, compilación y Prisma
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    openssl \
    openssl-dev \
    libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY yarn.lock ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar código fuente
COPY . .

# Generar Prisma client con el binary target correcto
RUN npx prisma generate --binary-target=linux-musl-openssl-3.0.x

# Build de la aplicación
RUN yarn build

# Exponer puerto
EXPOSE 3000

# Comando por defecto
CMD ["node", "dist/main"]
