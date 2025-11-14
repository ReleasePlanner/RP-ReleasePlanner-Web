# Stage 1: Build stage - Compilar la aplicación NestJS
FROM node:20-alpine AS builder

# Establecer directorio de trabajo en la raíz del workspace
WORKDIR /app

# Copiar archivos de configuración de dependencias del workspace
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copiar configuración de la API
COPY apps/api/package.json ./apps/api/
COPY apps/api/webpack.config.js ./apps/api/
COPY apps/api/tsconfig*.json ./apps/api/

# Instalar dependencias del workspace
RUN npm ci --legacy-peer-deps

# Copiar código fuente de la API y librerías compartidas
COPY apps/api/src ./apps/api/src
COPY libs ./libs

# Construir la aplicación para producción
WORKDIR /app
RUN npx nx build api

# Stage 2: Production stage - Ejecutar la aplicación
FROM node:20-alpine

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias del workspace
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copiar package.json de la API
COPY apps/api/package.json ./apps/api/

# Instalar solo dependencias de producción
RUN npm ci --omit=dev --legacy-peer-deps && \
    npm cache clean --force

# Copiar archivos compilados desde el builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules

# Cambiar propietario de los archivos
RUN chown -R nestjs:nodejs /app

# Cambiar al usuario no-root
USER nestjs

# Exponer puerto 3000
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Cambiar al directorio de la API
WORKDIR /app/apps/api

# Iniciar la aplicación directamente sin entrypoint
ENTRYPOINT []
CMD ["node", "dist/main.js"]

