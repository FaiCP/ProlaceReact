# ── Stage 1: Build ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar archivos del workspace raíz
COPY package*.json turbo.json ./
COPY packages/types/ ./packages/types/
COPY frontend/package*.json ./frontend/

# Instalar dependencias
RUN npm ci --workspaces --include-workspace-root

# Copiar fuente del frontend
COPY frontend/ ./frontend/

WORKDIR /app/frontend

# Build de producción con Vite
RUN npm run build

# ── Stage 2: Producción (Nginx) ───────────────────────────────
FROM nginx:alpine
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
