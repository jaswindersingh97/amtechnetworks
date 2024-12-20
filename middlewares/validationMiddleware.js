const { check, validationResult } = require('express-validator');

// Validation rules for registration
const registerValidation = [
  check('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ max: 50 }).withMessage('Username must be less than 50 characters'),
  
  check('email')
    .isEmail().withMessage('Email is required and must be valid')
    .isLength({ max: 100 }).withMessage('Email must be less than 100 characters'),
  check('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

// Validation rules for login
const loginValidation = [
  check('username')
    .notEmpty().withMessage('Username is required'),
  
  check('password')
    .notEmpty().withMessage('Password is required'),
];

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  validate,
};
