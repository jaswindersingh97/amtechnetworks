const express = require('express');
const router = express.Router();
const {  renderRegisterPage, 
    renderLoginPage, 
    register, 
    login, 
    getProfile, 
    logout 
  } = require('./../controllers/authControllers');
const { registerValidation, loginValidation, validate } = require('./../middlewares/validationMiddleware');
const authenticateToken = require('./../middlewares/authMiddleware');


// GET Registration Page
router.get('/register', renderRegisterPage);

// GET Login Page
router.get('/login', renderLoginPage);

// GET Profile Page (Protected)
router.get('/profile', authenticateToken, getProfile);

// POST Register User
router.post('/register', registerValidation, validate, register);

// POST Login User
router.post('/login', loginValidation, validate, login);

// POST Logout User
router.post('/logout', logout);

module.exports = router;
