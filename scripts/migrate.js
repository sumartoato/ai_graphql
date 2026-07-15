/**
 * Migration: Membuat tabel-tabel database.
 *
 * Cara pakai:
 *   node scripts/migrate.js
 *
 * Atau via npm:
 *   npm run migrate
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const mariadb = require('mysql2/promise');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'graphql_user',
  password: process.env.DB_PASSWORD || 'Gr@phQL_2026!',
  database: process.env.DB_NAME || 'ai_graphql',
  multipleStatements: true,
};

async function migrate() {
  console.log('⏳ Menjalankan migration...\n');

  const conn = await mariadb.createConnection(DB_CONFIG);

  try {
    // ─── Tabel: users ───────────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(100)   NOT NULL,
        email      VARCHAR(255)   NOT NULL UNIQUE,
        password   VARCHAR(255)   NOT NULL,
        role       ENUM('user', 'admin') NOT NULL DEFAULT 'user',
        createdAt  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_users_email (email),
        INDEX idx_users_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('  ✅ Tabel users — OK');

    // ─── Tabel: refresh_tokens ──────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        userId     INT            NOT NULL,
        token      VARCHAR(500)   NOT NULL,
        expiresAt  DATETIME       NOT NULL,
        createdAt  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_refresh_token (token)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('  ✅ Tabel refresh_tokens — OK');

    // ─── Tabel: audit_logs ──────────────────────────
    await conn.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        userId     INT            NULL,
        action     VARCHAR(100)   NOT NULL,
        metadata   JSON           NULL,
        ipAddress  VARCHAR(45)    NULL,
        createdAt  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_audit_user (userId),
        INDEX idx_audit_action (action),
        INDEX idx_audit_created (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('  ✅ Tabel audit_logs — OK');

    console.log('\n✅ Migration selesai — semua tabel berhasil dibuat.');
  } catch (err) {
    console.error('\n❌ Migration gagal:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

migrate();
