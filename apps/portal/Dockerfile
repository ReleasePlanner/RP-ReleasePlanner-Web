# Stage 1: Build stage - Compilar la aplicación React
FROM node:20-alpine AS builder

# Establecer directorio de trabajo en la raíz del workspace
WORKDIR /app

# Copiar archivos de configuración de dependencias del workspace
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY vitest.workspace.ts ./

# Copiar configuración del portal
COPY apps/portal/package.json ./apps/portal/ 2>/dev/null || true
COPY apps/portal/vite.config.ts ./apps/portal/
COPY apps/portal/tsconfig*.json ./apps/portal/
COPY apps/portal/index.html ./apps/portal/
COPY apps/portal/postcss.config.js ./apps/portal/ 2>/dev/null || true
COPY apps/portal/tailwind.config.js ./apps/portal/ 2>/dev/null || true

# Copiar configuración de librerías compartidas
COPY libs/rp-shared/package.json ./libs/rp-shared/ 2>/dev/null || true
COPY libs/rp-shared/tsconfig*.json ./libs/rp-shared/ 2>/dev/null || true

# Instalar dependencias del workspace
RUN npm ci --legacy-peer-deps

# Copiar código fuente de las librerías compartidas primero
COPY libs ./libs

# Construir librerías compartidas si existen
RUN npx nx build rp-shared || echo "rp-shared build skipped"

# Copiar código fuente del portal
COPY apps/portal/src ./apps/portal/src
COPY apps/portal/public ./apps/portal/public

# Construir la aplicación para producción
WORKDIR /app
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npx nx build portal --configuration=production

# Stage 2: Production stage - Servir con Nginx
FROM nginx:alpine

# Copiar archivos estáticos compilados desde el builder
COPY --from=builder /app/apps/portal/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY apps/portal/nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

