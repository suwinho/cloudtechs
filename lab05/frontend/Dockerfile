ARG BUILD_DATE
ARG VERSION
ARG NODE_ENV=production

# REACT
FROM node:22-alpine AS deps
WORKDIR app/
COPY package*.json .
RUN npm ci

From node:22-alpine AS builder
WORKDIR app/
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps --chown=app:app /app/node_modules ./node_modules
COPY --chown=app:app . . 
RUN npm run build

# NGINX
FROM nginx:stable-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY cache.conf /etc/nginx/conf.d/cache.conf
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost:80/ || exit 1
EXPOSE 80
USER nginx
CMD ["nginx", "-g", "daemon off;"]


LABEL org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.title="Frontend" \
      node_env=$NODE_ENV