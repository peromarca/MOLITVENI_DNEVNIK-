const { Pool } = require('pg');
require('dotenv').config();

// Kreiranje connection pool-a za PostgreSQL
const pool = new Pool({
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   database: process.env.DB_NAME,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
});

// Test konekcije
pool.connect((err, client, release) => {
   if (err) {
      console.error('Greška prilikom konekcije na bazu:', err.stack);
   } else {
      console.log('✅ Uspešno povezano sa PostgreSQL bazom!');
      release();
   }
});

module.exports = pool;