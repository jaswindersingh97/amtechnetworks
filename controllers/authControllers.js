const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerUser, findUserByUsername, findUserByEmail } = require('../models/userModel');
const axios = require('axios');
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
const asyncHandler = require('express-async-handler');

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingEmail = await findUserByEmail(email);
  const existingUsername = await findUserByUsername(username);

  if (existingEmail || existingUsername) {
    res.status(400);
    throw new Error("Email or Username already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await registerUser(username, email, hashedPassword);

  res.status(201).json({ message: "User registered successfully. Please log in." });
});

  const verifyRecaptcha = async (recaptchaToken) => {
    const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: recaptchaToken,
            },
        }
    );
    return response.data.success;
  };


  //login route
  const login = asyncHandler(async (req, res) => {
  const { username, password, 'g-recaptcha-response': recaptchaToken } = req.body;
  //verify recaptcha
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
      res.status(400);
      throw new Error('reCAPTCHA verification failed. Please try again.');
  }
  // Check username
  const user = await findUserByUsername(username);
  if (!user) {
    res.status(400);
    throw new Error("Invalid username or password.");
  }
  // Compare password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(400);
    throw new Error("Invalid username or password.");
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email ,created_at: user.created_at},
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  // Set token in cookie
  res.cookie('token', token, { httpOnly: true, maxAge: 15 * 60 * 1000 });
  res.redirect('/auth/profile');
});

module.exports = {
  renderRegisterPage,
  renderLoginPage,
  register,
  login,
  getProfile,
  logout
};
