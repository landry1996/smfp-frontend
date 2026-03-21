# ============================================================
# Stage 1 — Build Angular (production)
# ============================================================
FROM node:22-alpine AS build

WORKDIR /app

# Copier les manifestes en premier pour profiter du cache Docker
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copier le reste du code source
COPY . .

# Build de production
RUN npx ng build --configuration production

# ============================================================
# Stage 2 — Servir avec Nginx
# ============================================================
FROM nginx:1.27-alpine

# Supprimer la config Nginx par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier la config personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis le stage 1
COPY --from=build /app/dist/smfp-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
