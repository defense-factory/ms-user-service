# ms-user-service

Small Express service for demo user authentication and inventory lookups.

## Run

```bash
npm ci
npm start
```

The server listens on port 3000. Set `JWT_SECRET` and `INVENTORY_SERVICE_URL` to
override the demo defaults.

## Test

```bash
npm test
```

⚠️ This repo contains deliberately vulnerable dependencies for demo purposes —
do not deploy. Seeded findings include CVE-2021-3749 (axios),
CVE-2020-8203 and CVE-2021-23337 (lodash), and CVE-2022-23539
(jsonwebtoken).
