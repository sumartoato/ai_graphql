require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'graphql_user',
    password: process.env.DB_PASSWORD || 'Gr@phQL_2026!',
    name: process.env.DB_NAME || 'ai_graphql',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-to-a-random-secret-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};

module.exports = config;
