/**
 * Input Validation Middleware
 * Validates request body, params, and queries
 */

const { body, param, query, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => `${err.param}: ${err.msg}`);
    return next(new AppError(messages.join(', '), 400));
  }
  next();
};

/**
 * Auth Validation Rules
 */
const authValidation = {
  signup: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username must be 3-30 characters, alphanumeric with _ and -'),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must be 8+ characters with uppercase, lowercase, number, and special character'),
    body('passwordConfirm')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
  ],

  signin: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],

  verifyOtp: [
    body('otp')
      .trim()
      .isLength({ min: 4, max: 6 })
      .isNumeric()
      .withMessage('OTP must be 4-6 digits'),
  ],

  forgotPassword: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
  ],

  resetPassword: [
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('passwordConfirm')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
  ],
};

/**
 * User Validation Rules
 */
const userValidation = {
  updateProfile: [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be 3-30 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio must be less than 500 characters'),
    body('phoneNumber')
      .optional()
      .trim()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
  ],

  requestClubAdmin: [
    body('clubId')
      .isMongoId()
      .withMessage('Invalid club ID'),
    body('reason')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Reason must be less than 500 characters'),
  ],
};

/**
 * Club Validation Rules
 */
const clubValidation = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Club name must be 3-100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('category')
      .isIn(['Sports', 'Arts', 'Technology', 'Environment', 'Academic', 'Literature'])
      .withMessage('Invalid category'),
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Club name must be 3-100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    body('category')
      .optional()
      .isIn(['Sports', 'Arts', 'Technology', 'Environment', 'Academic', 'Literature'])
      .withMessage('Invalid category'),
  ],

  getId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid club ID'),
  ],
};

/**
 * Event Validation Rules
 */
const eventValidation = {
  create: [
    body('title')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Event title must be 3-200 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be 10-2000 characters'),
    body('clubId')
      .isMongoId()
      .withMessage('Invalid club ID'),
    body('eventDate')
      .isISO8601()
      .custom(value => new Date(value) > new Date())
      .withMessage('Event date must be in the future'),
    body('registrationType')
      .isIn(['individual', 'team'])
      .withMessage('Invalid registration type'),
    body('maxRegistrations')
      .optional({ checkFalsy: true })
      .isInt({ min: 1 })
      .withMessage('Max registrations must be at least 1'),
    body('registrationFee')
      .optional({ checkFalsy: true })
      .isFloat({ min: 0 })
      .withMessage('Registration fee must be non-negative'),
  ],

  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Event title must be 3-200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage('Description must be 10-2000 characters'),
  ],

  getId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid event ID'),
  ],
};

/**
 * Team Validation Rules
 */
const teamValidation = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Team name must be 3-100 characters'),
    body('eventId')
      .isMongoId()
      .withMessage('Invalid event ID'),
    body('maxMembers')
      .isInt({ min: 2, max: 100 })
      .withMessage('Max members must be between 2 and 100'),
  ],
};

/**
 * Feedback Validation Rules
 */
const feedbackValidation = {
  create: [
    body('eventId')
      .isMongoId()
      .withMessage('Invalid event ID'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Comment must be less than 1000 characters'),
  ],
};

/**
 * Payment Validation Rules
 */
const paymentValidation = {
  create: [
    body('eventId')
      .isMongoId()
      .withMessage('Invalid event ID'),
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be greater than 0'),
  ],

  verify: [
    body('orderId')
      .notEmpty()
      .withMessage('Order ID is required'),
    body('paymentId')
      .notEmpty()
      .withMessage('Payment ID is required'),
    body('signature')
      .notEmpty()
      .withMessage('Signature is required'),
  ],
};

/**
 * Pagination Validation
 */
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt()
    .withMessage('Limit must be between 1 and 100'),
];

/**
 * ID Parameter Validation
 */
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];

/**
 * User ID Parameter Validation
 */
const userIdValidation = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID format'),
];

module.exports = {
  handleValidationErrors,
  authValidation,
  userValidation,
  clubValidation,
  eventValidation,
  teamValidation,
  feedbackValidation,
  paymentValidation,
  paginationValidation,
  idValidation,
  userIdValidation,
};
