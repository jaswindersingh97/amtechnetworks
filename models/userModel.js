const db = require('../config/db');

// Create a new user
const registerUser = async (username, email, password) => {
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email;
  `;
  const values = [username, email, password];
  const result = await db.query(query, values);
  return result.rows[0];
};

// Find user by email
const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const values = [email];
  const result = await db.query(query, values);
  return result.rows[0];
};

// Find user by username
const findUserByUsername = async (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  const values = [username];
  const result = await db.query(query, values);
  return result.rows[0];
};

module.exports = {
  registerUser,
  findUserByEmail,
  findUserByUsername
};
