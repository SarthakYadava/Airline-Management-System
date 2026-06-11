# Deployment Guide

SkyRoute is packaged as seven containers:

- Web client
- API gateway
- Auth service
- Flight service
- Booking service
- Notification service
- RabbitMQ

The four database-backed services use separate MySQL databases.

## Local Container Stack

Requirements:

- Docker Desktop with Docker Compose

Create a local environment file:

```bash
cp .env.example .env
```

Replace the example passwords and JWT key, then start the stack:

```bash
npm run docker:up
```

The first build may take several minutes. Database migrations run when each
service container starts.

Load the demo roles, cities, airports, aircraft, and future flights once:

```bash
npm run docker:seed
```

Open:

- Web client: `http://localhost:8080`
- API gateway health: `http://localhost:4000/health`
- RabbitMQ management: `http://localhost:15672`

Stop the stack without deleting database volumes:

```bash
npm run docker:down
```

## Production Topology

Deploy each Dockerfile as a separate service from the repository root:

| Component | Dockerfile | Public |
| --- | --- | --- |
| Web | `apps/web/Dockerfile` | Yes |
| API gateway | `services/api-gateway/Dockerfile` | Yes |
| Auth | `services/auth-service/Dockerfile` | No |
| Flights | `services/flight-service/Dockerfile` | No |
| Bookings | `services/booking-service/Dockerfile` | No |
| Notifications | `services/notification-service/Dockerfile` | No |

Provision MySQL and RabbitMQ through the hosting platform or another managed
provider. Keep the internal services private and expose only the web client and
API gateway.

## Required Variables

### Web build

`VITE_API_URL` must contain the public HTTPS URL of the API gateway. It is a
build argument because Vite embeds it in the browser bundle.

### API gateway

- `PORT`
- `CLIENT_URLS`: comma-separated allowed frontend origins
- `AUTH_SERVICE_URL`
- `BOOKING_SERVICE_URL`
- `FLIGHT_SERVICE_URL`

### Auth service

- `PORT`
- `DATABASE_URL`
- `JWT_KEY`

### Flight service

- `PORT`
- `DATABASE_URL`

### Booking service

- `PORT`
- `DATABASE_URL`
- `FLIGHT_SERVICE_PATH`
- `MESSAGE_BROKER_URL`
- `EXCHANGE_NAME`
- `REMINDER_BINDING_KEY`

### Notification service

- `PORT`
- `DATABASE_URL`
- `MESSAGE_BROKER_URL`
- `EXCHANGE_NAME`
- `REMINDER_BINDING_KEY`
- `BROKER_RETRY_MS`
- `EMAIL_ID`
- `EMAIL_PASS`

Use URL-safe database and broker passwords when credentials are embedded in
connection URLs.

## Release Order

1. Provision MySQL databases and RabbitMQ.
2. Deploy the flight, auth, booking, and notification services.
3. Run the auth and flight seed commands once if demo data is required.
4. Deploy the API gateway with the internal service URLs.
5. Build and deploy the web client with the public gateway URL.
6. Verify every `/health` endpoint over HTTPS.
7. Test signup, signin, flight search, booking, and trip history.

## Operational Notes

- Database migrations run automatically when service containers start.
- Demo seed commands are intentionally manual to avoid duplicate production data.
- The notification service retries RabbitMQ connections instead of exiting.
- The frontend container serves the SPA through Nginx and caches hashed assets.
- CI tests the backend, builds the frontend, and builds every Dockerfile.

