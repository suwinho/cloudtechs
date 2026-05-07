ARG BUILD_DATE
ARG VERSION
ARG NODE_ENV=production

# REACT
FROM node:22-alpine AS deps
WORKDIR app/
COPY package*.json .
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR app/
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps --chown=app:app /app/node_modules ./node_modules
COPY --chown=app:app . . 
RUN npm run build

# NGINX
FROM nginx:stable-alpine AS production
ARG BUILD_DATE
ARG VERSION
ARG NODE_ENV=production
RUN apk add --no-cache curl && \
    mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx && \
    chmod -R 755 /var/cache/nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1
EXPOSE 80
USER nginx
ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]


LABEL org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.title="Frontend" \
      node_env=$NODE_ENV