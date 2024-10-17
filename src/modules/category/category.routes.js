const router = require('express').Router()
const validationMiddleware = require('~/middlewares/validation')
const idValidation = require('~/middlewares/idValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')

const categoryController = require('./category.controller')
const { categoryValidation } = require('./category.schemas')

router.use(authMiddleware)
router.param('id', idValidation)

router.get('/', asyncWrapper(categoryController.findAll))
router.get('/:id', asyncWrapper(categoryController.findById))
router.post('/', validationMiddleware(categoryValidation.CREATE), asyncWrapper(categoryController.create))

module.exports = router
