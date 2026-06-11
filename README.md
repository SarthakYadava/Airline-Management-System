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

Each service includes an `.env.example` file. Database configuration currently
uses a local `src/config/config.json` file in the database-backed services.
Detailed setup commands will be added as the configuration is consolidated.

