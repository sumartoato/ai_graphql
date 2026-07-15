# Architecture

## Overview

Aplikasi ini menggunakan arsitektur **GraphQL + Node.js** dengan pemisahan concern yang jelas.

```
┌─────────────────────────────────────────┐
│              Client (Web/Mobile)         │
└──────────────┬──────────────────────────┘
               │ HTTP / WebSocket
┌──────────────▼──────────────────────────┐
│           Express Server                 │
│  ┌────────────────────────────────────┐  │
│  │        GraphQL Middleware          │  │
│  │  (Apollo Server / express-graphql) │  │
│  └──────────────┬─────────────────────┘  │
└─────────────────┼────────────────────────┘
                  │
     ┌────────────┼────────────┐
     ▼            ▼            ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│Resolvers│ │ Models  │ │Services │
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     └───────────┼───────────┘
                 ▼
         ┌──────────────┐
         │   Database   │
         │  (MariaDB)   │
         └──────────────┘
```

## Struktur Direktori

- **src/config/** - Konfigurasi aplikasi (database, env, dll)
- **src/graphql/schema/** - Definisi schema GraphQL
- **src/graphql/resolvers/** - Resolver functions
- **src/graphql/types/** - Type definitions (GraphQL SDL)
- **src/middleware/** - Express middleware (auth, logging, dll)
- **src/models/** - Database models (ORM)
- **src/routes/** - REST routes (jika ada)
- **src/server.js** - Entry point server
