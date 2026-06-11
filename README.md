# SkyRoute Airline Platform

SkyRoute is a learning-focused airline platform built as a collection of Node.js
microservices. The backend covers flight inventory, user authentication,
bookings, API routing, and email notification workflows.

The project includes a responsive React web client, stronger validation,
automated tests, and a simplified local development experience.

## Services

| Service | Purpose |
| --- | --- |
| API Gateway | Routes client traffic and protects booking endpoints |
| Auth Service | Handles account creation, sign-in, and token validation |
| Flight Service | Manages cities, airports, aircraft, and flight inventory |
| Booking Service | Creates bookings and updates available seats |
| Notification Service | Stores and sends scheduled email notifications |

## Technology

- Node.js and Express
- MySQL and Sequelize
- JSON Web Tokens and bcrypt
- RabbitMQ
- Nodemailer
- React, TypeScript, and Vite

## Web Experience

The traveler-facing frontend includes:

- Responsive flight search with airport and date selection
- Clear flight result cards with duration, fare, seats, and gate information
- Route visualization generated from airport coordinates
- Account creation and token-based sign-in
- Protected booking review and confirmation flow
- Authenticated booking history with status and fare summaries
- Premium destination, lounge, and cabin-service sections
- Loading, empty, API fallback, and mobile navigation states

When the backend is unavailable, the frontend labels and displays preview data
so the interface remains explorable without presenting it as a live response.

## Current Status

The backend has been imported into a single workspace. Setup automation,
backend fixes, tests, and the frontend are being added incrementally.

## Local Setup

Requirements:

- Node.js 20 or newer
- MySQL 8
- RabbitMQ

Install all workspace dependencies:

```bash
npm install
```

Start the web client:

```bash
npm run dev:web
```

The frontend uses `http://localhost:4000` by default. Copy
`apps/web/.env.example` to `apps/web/.env` to use another API gateway URL.

Each service includes an `.env.example` file. Copy it to `.env`, update the
database credentials, then create and migrate each database:

```bash
npm run db:create --workspace @skyroute/flight-service
npm run db:migrate --workspace @skyroute/flight-service
```

Use the same commands with the auth, booking, and notification workspace names.

## Tests

Run the backend unit tests from the repository root:

```bash
npm test
```

The current suite covers authentication validation, token user lookups, flight
schedule rules, airplane capacity, booking totals, and seat availability.
