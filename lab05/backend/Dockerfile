ARG BUILD_DATE
ARG VERSION
ARG NODE_ENV=production

FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./ 
RUN npm ci --only=production

FROM deps AS test
RUN npm install
COPY . .
RUN npm test

FROM node:18-alpine AS production
ARG BUILD_DATE
ARG VERSION
ARG NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache curl
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps --chown=app:app /app/node_modules ./node_modules
COPY --chown=app:app . .
USER app
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000
CMD ["node", "server.js"]


LABEL org.opencontainers.image.created=$BUILD_DATE \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.title="Backend" \
      node_env=$NODE_ENV