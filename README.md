# SkyRoute Airline Platform

SkyRoute is a learning-focused airline platform built as a collection of Node.js
microservices. The backend covers flight inventory, user authentication,
bookings, API routing, and email notification workflows.

The project is being expanded into a full-stack portfolio application with a
responsive web client, stronger validation, automated tests, and a simpler
local development experience.

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

Each service includes an `.env.example` file. Copy it to `.env`, update the
database credentials, then create and migrate each database:

```bash
npm run db:create --workspace @skyroute/flight-service
npm run db:migrate --workspace @skyroute/flight-service
```

Use the same commands with the auth, booking, and notification workspace names.
