const router = require('express').Router()
const validationMiddleware = require('~/middlewares/validation')
const idValidation = require('~/middlewares/idValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const {
  roles: { ADMIN }
} = require('~/consts/auth')

const categoryController = require('./category.controller')
const { categoryValidation } = require('./category.schemas')

router.use(authMiddleware)
router.param('id', idValidation)

// @desc    Get all categories
// @route 	GET /categories
// @access  Private (Authenticated users)
router.get('/', asyncWrapper(categoryController.findAll))

// @desc    Get all categories names
// @route 	GET /categories/names
// @access  Private (Authenticated users)
router.get('/names', asyncWrapper(categoryController.findAllNames))

// @desc    Get category by id
// @route 	GET /categories/:id
// @access  Private (Authenticated users)
router.get('/:id', asyncWrapper(categoryController.findById))

router.use(restrictTo(ADMIN))
// @desc    Create category
// @route 	POST /categories
// @access  Private (ADMIN)
router.post('/', validationMiddleware(categoryValidation.CREATE), asyncWrapper(categoryController.create))

module.exports = router
