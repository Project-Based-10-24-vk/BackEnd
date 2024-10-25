const router = require('express').Router()
const idValidation = require('~/middlewares/idValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { restrictTo, authMiddleware } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')
const {
  roles: { ADMIN }
} = require('~/consts/auth')

const User = require('./user.model')
const userController = require('./user.controller')

const params = [{ model: User, idName: 'id' }]

router.use(authMiddleware)
router.param('id', idValidation)

// @desc    Get all users
// @route 	GET /users
// @access  Private (Authenticated users)
router.get('/', asyncWrapper(userController.findMany))

// @desc    Get user by id
// @route 	GET /users/:id
// @access  Private (Authenticated users)
router.get('/:id', isEntityValid({ params }), asyncWrapper(userController.findOneById))

// @desc    Update user by id
// @route 	PATCH /users/:id
// @access  Private (Authenticated users)
router.patch('/:id', isEntityValid({ params }), asyncWrapper(userController.update))

router.use(restrictTo(ADMIN))
// @desc    Update user status by id
// @route 	PATCH /users/:id/change-status
// @access  Private (ADMIN)
router.patch('/:id/change-status', isEntityValid({ params }), asyncWrapper(userController.updateStatus))

// @desc    Remove user by id
// @route 	DELETE /users/:id
// @access  Private (ADMIN)
router.delete('/:id', isEntityValid({ params }), asyncWrapper(userController.remove))

module.exports = router
