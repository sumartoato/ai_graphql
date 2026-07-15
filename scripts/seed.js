/**
 * Seed: Mengisi data awal ke database.
 *
 * Cara pakai:
 *   node scripts/seed.js
 *
 * Atau via npm:
 *   npm run seed
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const mariadb = require('mysql2/promise');
const bcrypt = require('bcrypt');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'graphql_user',
  password: process.env.DB_PASSWORD || 'Gr@phQL_2026!',
  database: process.env.DB_NAME || 'ai_graphql',
};

async function seed() {
  console.log('⏳ Menjalankan seed...\n');

  const conn = await mariadb.createConnection(DB_CONFIG);

  try {
    const hash = await bcrypt.hash('Admin@123', 12);

    // Admin user
    await conn.query(`
      INSERT IGNORE INTO users (name, email, password, role)
      VALUES ('Admin Utama', 'admin@aigraphql.com', '${hash}', 'admin')
    `);
    console.log('  ✅ Admin user — email: admin@aigraphql.com / password: Admin@123');

    // Regular user
    const userHash = await bcrypt.hash('User@123', 12);
    await conn.query(`
      INSERT IGNORE INTO users (name, email, password, role)
      VALUES ('User Biasa', 'user@aigraphql.com', '${userHash}', 'user')
    `);
    console.log('  ✅ Regular user — email: user@aigraphql.com / password: User@123');

    console.log('\n✅ Seed selesai — data awal berhasil diisi.');
  } catch (err) {
    console.error('\n❌ Seed gagal:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

seed();
