const { Pool } = require('pg');
require('dotenv').config();


const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool(
  isProduction
    ? {
        host: process.env.NEON_DB_HOST,
        user: process.env.NEON_DB_USER,
        password: process.env.NEON_DB_PASSWORD,
        database: process.env.NEON_DB_NAME,
        port: process.env.NEON_DB_PORT,
      }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
      }
);

module.exports = pool;