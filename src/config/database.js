const mariadb = require('mysql2/promise');
const config = require('./index');

const pool = mariadb.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '+07:00',
});

pool.getConnection()
  .then((conn) => {
    console.log('[DB] Koneksi database berhasil');
    conn.release();
  })
  .catch((err) => {
    console.error('[DB] Gagal koneksi ke database:', err.message);
  });

module.exports = pool;
