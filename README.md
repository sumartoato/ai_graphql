# AI GraphQL API

GraphQL API production-ready — **Node.js + Apollo Server v4 + MariaDB + JWT Authentication**.

Dibangun dengan arsitektur modern, siap deploy ke production. Mendukung multi-role user (admin/user), pagination, audit logging, dan refresh token.

## ✨ Fitur

| Fitur | Status |
|-------|--------|
| GraphQL Query & Mutation | ✅ |
| JWT Authentication (login/register) | ✅ |
| Multi-role (admin, user) | ✅ |
| Pagination & Filtering | ✅ |
| Input Validation | ✅ |
| Audit Log | ✅ |
| Refresh Token | ✅ |
| Error Handling Terstruktur | ✅ |
| CORS Ready | ✅ |
| CI/CD (GitHub Actions) | ✅ |

## 🧱 Tech Stack

- **Runtime:** Node.js 18+ / 20+ / 22+
- **Server:** Express.js + Apollo Server v4
- **Database:** MariaDB 12+ (MySQL compatible)
- **Auth:** JWT (jsonwebtoken) + bcrypt (12 salt rounds)
- **ORM:** Raw SQL via mysql2 (performant, no overhead)

## 📁 Struktur Proyek

```
ai-graphql/
├── .github/workflows/    # CI/CD pipeline
├── docs/                 # Dokumentasi
├── scripts/
│   ├── migrate.js        # Migration database
│   └── seed.js           # Seed data awal
├── src/
│   ├── config/
│   │   ├── index.js      # Env configuration
│   │   └── database.js   # MariaDB connection pool
│   ├── graphql/
│   │   ├── resolvers/    # Business logic resolvers
│   │   └── typeDefs.js   # GraphQL schema (SDL)
│   ├── middleware/
│   │   ├── auth.js       # JWT authentication
│   │   ├── logger.js     # Request logging
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── index.js      # REST health check
│   └── server.js         # Entry point
├── .env.example           # Template environment
├── package.json
└── README.md
```

## 🚀 Instalasi & Setup

### 1. Prasyarat

Pastikan sudah terinstall:

```bash
node -v     # >= 18.x
npm -v      # >= 9.x
mysql --version   # MariaDB 10.6+ / MySQL 8+
```

### 2. Clone & Install

```bash
git clone https://github.com/sumartoato/ai_graphql.git
cd ai_graphql
npm install
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env
```

Edit `.env` sesuai lingkungan Anda:

```env
# Server
NODE_ENV=development
PORT=4000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=graphql_user
DB_PASSWORD=Gr@phQL_2026!
DB_NAME=ai_graphql

# JWT
JWT_SECRET=buat-random-string-panjang-disini
JWT_EXPIRES_IN=7d
```

> **⚠️ PENTING:** Ganti `JWT_SECRET` dengan string acak yang kuat di production.
> Bisa generate dengan: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 4. Setup Database

Buat database dan user:

```bash
# Masuk ke MariaDB
sudo mariadb

# Di dalam shell MariaDB:
CREATE DATABASE IF NOT EXISTS ai_graphql CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'graphql_user'@'localhost' IDENTIFIED BY 'Gr@phQL_2026!';
GRANT ALL PRIVILEGES ON ai_graphql.* TO 'graphql_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Migration & Seed

```bash
# Buat tabel-tabel database
npm run migrate

# Isi data awal
npm run seed
```

Atau sekali jalan:

```bash
npm run setup
```

### 6. Jalankan Server

```bash
# Development (dengan hot-reload)
npm run dev

# Production
npm start
```

## 🧪 Testing API

Server berjalan di `http://localhost:4000`.

### Health Check

```bash
curl http://localhost:4000/api/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-07-15T09:00:00.000Z"
}
```

### Login (mendapatkan JWT token)

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { login(input: { email: \"admin@aigraphql.com\", password: \"Admin@123\" }) { token user { id name email role } } }"
  }' | jq .
```

### Query Profile (Me)

```bash
TOKEN="<token-dari-login>"

curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "{ me { id name email role } }"}' | jq .
```

### Register User Baru

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { register(input: { name: \"Budi\", email: \"budi@test.com\", password: \"Rahasia123!\" }) { token user { id name email role } } }"
  }' | jq .
```

## 🗄️ Schema GraphQL

```graphql
# ─── Query ───────────────────
type Query {
  users(page: Int, limit: Int): UsersResult!    # List users (admin only)
  user(id: ID!): User                           # Detail user
  me: User                                      # Profile sendiri
}

# ─── Mutation ────────────────
type Mutation {
  # Auth
  login(input: LoginInput!): AuthPayload!
  register(input: RegisterInput!): AuthPayload!

  # User CRUD (admin only)
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}
```

### Data Awal (Seed)

| Email | Password | Role |
|-------|----------|------|
| admin@aigraphql.com | Admin@123 | admin |
| user@aigraphql.com | User@123 | user |

## 🛠️ Scripts

| Script | Fungsi |
|--------|--------|
| `npm start` | Jalankan production server |
| `npm run dev` | Jalankan dev server (nodemon) |
| `npm run migrate` | Buat tabel database |
| `npm run seed` | Isi data awal |
| `npm run setup` | Migrate + seed sekali jalan |
| `npm run lint` | Cek kode dengan ESLint |
| `npm run format` | Format kode dengan Prettier |
| `npm test` | Jalankan test |

## 🔐 Keamanan

- Password di-hash dengan **bcrypt** (salt rounds: 12)
- JWT token dengan **expiry time** (default 7 hari)
- **Role-based access control** (admin vs user)
- SQL injection dicegah via **parameterized queries** (mysql2)
- Input validation di level GraphQL schema
- CORS configurable

## 📦 Deployment

### Production Checklist

- [ ] Ganti `JWT_SECRET` dengan random string kuat
- [ ] Set `NODE_ENV=production`
- [ ] Nonaktifkan GraphQL introspection (`NODE_ENV=production` otomatis)
- [ ] Gunakan process manager (PM2 / systemd)
- [ ] Setup firewall database (port 3306 tidak publik)
- [ ] Konfigurasi CORS origin spesifik

### Contoh PM2

```bash
npm install -g pm2
pm2 start src/server.js --name ai-graphql -i max
pm2 save
pm2 startup
```

## 📄 Lisensi

MIT — silakan gunakan, modifikasi, dan distribusikan.
