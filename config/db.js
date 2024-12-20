const { Client } = require('pg');
require('dotenv').config();

if (!process.env.DB_URL) {
  throw new Error("DB_URL environment variable is not set");
}

// Create a new PostgreSQL client instance
const client = new Client({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false },
});

// Connect to the database
client.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the PostgreSQL database');
  }
});

// Export the client for use in your application
module.exports = {
  query: (text, params) => client.query(text, params),
};
