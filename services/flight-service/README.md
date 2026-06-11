# Flight Service

The flight service manages cities, airports, aircraft, flight schedules, seat
inventory, and search filters.

Copy `.env.example` to `.env`, update the MySQL credentials, then run:

```bash
npm run db:create
npm run db:migrate
npm run db:seed
npm run dev
```
