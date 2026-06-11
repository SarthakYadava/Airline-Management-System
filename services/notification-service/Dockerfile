FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY services/api-gateway/package.json services/api-gateway/package.json
COPY services/auth-service/package.json services/auth-service/package.json
COPY services/booking-service/package.json services/booking-service/package.json
COPY services/flight-service/package.json services/flight-service/package.json
COPY services/notification-service/package.json services/notification-service/package.json
RUN npm ci --omit=dev
COPY services/notification-service services/notification-service

ENV NODE_ENV=production
EXPOSE 3003

CMD ["sh", "-c", "npm run db:migrate --workspace @skyroute/notification-service && npm run start --workspace @skyroute/notification-service"]
