# Stage 1: Build stage - Compilar la aplicación React
FROM node:20-alpine AS builder

# Establecer directorio de trabajo en la raíz del workspace
WORKDIR /app

# Copiar archivos de configuración de dependencias del workspace
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copiar configuración del portal
COPY apps/portal/package.json ./apps/portal/
COPY apps/portal/vite.config.ts ./apps/portal/
COPY apps/portal/tsconfig*.json ./apps/portal/
COPY apps/portal/index.html ./apps/portal/

# Instalar dependencias del workspace
RUN npm ci

# Copiar código fuente del portal y librerías compartidas
COPY apps/portal/src ./apps/portal/src
COPY apps/portal/public ./apps/portal/public
COPY libs ./libs

# Construir la aplicación para producción
WORKDIR /app/apps/portal
RUN npm run build

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

