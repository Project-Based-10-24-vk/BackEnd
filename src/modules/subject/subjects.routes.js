const router = require('express').Router()
const subjectController = require('./subject.controller')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const idValidation = require('~/middlewares/idValidation')
const { restrictTo, authMiddleware } = require('~/middlewares/auth')

const {
  roles: { ADMIN }
} = require('~/consts/auth')

router.use(authMiddleware)
router.param('id', idValidation)

// @desc    Get all subjects with params
// @route 	GET /subjects
// @access  Private (Authenticated users)
router.get('/', asyncWrapper(subjectController.findMany))

// @desc    Get all categories names
// @route 	GET /subjects/names
// @access  Private (Authenticated users)
router.get('/names', asyncWrapper(subjectController.findManyNames))

// @desc    Get subject by id
// @route 	GET /subjects/:id
// @access  Private (Authenticated users)
router.get('/:id', asyncWrapper(subjectController.findOneById))

router.use(restrictTo(ADMIN))
// @desc    Create subject
// @route 	POST /subjects
// @access  Private (ADMIN)
router.post('/', asyncWrapper(subjectController.create))

// @desc    Update subject
// @route 	PATCH /subjects
// @access  Private (ADMIN)
router.patch('/:id', asyncWrapper(subjectController.update))

// @desc    Delete subject
// @route 	DELETE /subjects
// @access  Private (ADMIN)
router.delete('/:id', asyncWrapper(subjectController.remove))

module.exports = router
