const db = require('../config/db'); // Database connection

// Function to create a new user

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await db.query(query);
    console.log('Table created or already exists.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};


const createUser = async (username, email, hashedPassword) => {
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at;
  `;
  const values = [username, email, hashedPassword];
  const result = await db.query(query, values);
  return result.rows[0];
};

// Function to find a user by email or username
const findUserByEmailOrUsername = async (identifier) => {
  const query = `
    SELECT id, username, email, password
    FROM users
    WHERE email = $1 OR username = $1;
  `;
  const values = [identifier];
  const result = await db.query(query, values);
  return result.rows[0];
};

// Function to get a user's profile details
const getUserById = async (userId) => {
  const query = `
    SELECT id, username, email, created_at
    FROM users
    WHERE id = $1;
  `;
  const values = [userId];
  const result = await db.query(query, values);
  return result.rows[0];
};

// Export the functions
module.exports = {
  createUser,
  findUserByEmailOrUsername,
  getUserById,
  createTable
};
