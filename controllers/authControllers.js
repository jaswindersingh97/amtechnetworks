const db = require('../config/db');

// Helper Function: Register User
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
