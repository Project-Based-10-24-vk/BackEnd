const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const validationMiddleware = require('~/middlewares/validation')
const langMiddleware = require('~/middlewares/appLanguage')

const authController = require('./auth.controller')
const signupValidationSchema = require('./schemas/signup')
const loginValidationSchema = require('./schemas/login')
const resetPasswordValidationSchema = require('./schemas/resetPassword')
const forgotPasswordValidationSchema = require('./schemas/forgotPassword')

// @desc    Register a new user
// @route 	POST /auth/signup
// @access  Public
router.post(
  '/signup',
  validationMiddleware(signupValidationSchema),
  langMiddleware,
  asyncWrapper(authController.signup)
)

// @desc    Login a user
// @route 	POST /auth/login
// @access  Public
router.post('/login', validationMiddleware(loginValidationSchema), asyncWrapper(authController.login))

// @desc    Logout a user
// @route 	POST /auth/logout
// @access  Private
router.post('/logout', asyncWrapper(authController.logout))

// @desc    Refresh access token
// @route 	GET /auth/refresh
// @access  Private
router.get('/refresh', asyncWrapper(authController.refreshAccessToken))

// @desc    Forgot password
// @route 	POST /auth/forgot-password
// @access  ???
router.post(
  '/forgot-password',
  validationMiddleware(forgotPasswordValidationSchema),
  langMiddleware,
  asyncWrapper(authController.sendResetPasswordEmail)
)

// @desc    Reset password
// @route 	PATCH /auth/reset-password/:token
// @access  ???
router.patch(
  '/reset-password/:token',
  validationMiddleware(resetPasswordValidationSchema),
  langMiddleware,
  asyncWrapper(authController.updatePassword)
)

// @desc    Confirm email
// @route 	GET /auth/confirm-email/:token
// @access  ???
router.get('/confirm-email/:token', asyncWrapper(authController.confirmEmail))

module.exports = router
