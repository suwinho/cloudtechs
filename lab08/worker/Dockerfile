FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:18-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/server.js ./
COPY --from=builder /app/db.js ./

RUN apk add --no-cache curl
RUN addgroup -S app && adduser -S app -G app
RUN chown -R app:app /app
USER app
ARG BACKEND_PORT=3000
EXPOSE ${BACKEND_PORT:-3000}

CMD ["node", "server.js"]
