# AI GraphQL

GraphQL API dengan Node.js, Express, dan Apollo Server.

## Fitur

- GraphQL API (Query, Mutation, Subscription)
- JWT Authentication
- CORS support
- Environment-based configuration
- REST health check endpoint
- Documentasi lengkap

## Tech Stack

- **Runtime:** Node.js
- **Server:** Express + Apollo Server
- **GraphQL:** Apollo Server Express
- **Auth:** JWT (jsonwebtoken) + bcrypt
- **Database:** MariaDB / MySQL (via Sequelize)

## Struktur Proyek

```
src/
├── config/        # Konfigurasi aplikasi
├── graphql/
│   ├── resolvers/ # GraphQL resolvers
│   ├── schema/    # Gabungan schema
│   └── types/     # Type definitions (SDL)
├── middleware/    # Express middleware
├── models/       # Database models
├── routes/       # REST routes
└── server.js     # Entry point
```

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Buka `http://localhost:4000/graphql` untuk GraphQL Playground.

## License

MIT
