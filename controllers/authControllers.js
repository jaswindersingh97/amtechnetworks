const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerUser, findUserByUsername, findUserByEmail } = require('../models/userModel');

// Render Registration Page
const renderRegisterPage = (req, res) => {
  res.render('register');  // Renders the registration form
};

// Render Login Page
const renderLoginPage = (req, res) => {
  res.render('login');  // Renders the login form
};

// Render Profile Page (Protected)
const getProfile = (req, res) => {
  const { user } = req;  // Comes from the authenticateToken middleware
  res.render('profile', { user });
};

// Logout user
const logout = (req, res) => {
  res.clearCookie('token');  // Clear the JWT token from cookies
  res.redirect('/auth/login');  // Redirect to login page after logout
};

// Registration Handler
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email or username already exists
    const existingEmail = await findUserByEmail(email);
    const existingUsername = await findUserByUsername(username);

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register user in the database
    const user = await registerUser(username, email, hashedPassword);
    res.status(201).json({ message: "User registered successfully. Please log in." });
  } catch (error) {
    res.status(500).json({ message: "Error registering user.", error });
  }
};

// Login Handler
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Compare password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Set JWT token in a cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    res.redirect('/auth/profile');
    // res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in.", error });
  }
};

module.exports = {
  renderRegisterPage,
  renderLoginPage,
  register,
  login,
  getProfile,
  logout
};
