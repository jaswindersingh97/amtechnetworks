const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_URL, 
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err);
  } else {
    console.log('Connected to the database');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params), 
};
