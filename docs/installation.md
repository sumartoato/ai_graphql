# Installation

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MariaDB / MySQL / PostgreSQL (sesuai konfigurasi)

## Langkah Instalasi

1. Clone repository:

```bash
git clone https://github.com/your-username/ai-graphql.git
cd ai-graphql
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. Edit `.env` sesuai konfigurasi lokal Anda.

5. Jalankan migrasi database:

```bash
npm run migrate
```

6. Jalankan server development:

```bash
npm run dev
```

Server akan berjalan di `http://localhost:4000`.
