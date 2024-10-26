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

// @desc    Get all subjects
// @route 	GET /subject
// @access  Private (Authenticated users)
router.get('/', asyncWrapper(subjectController.subjectsFind))

// @desc    Get subject by id
// @route 	GET /subject/:id
// @access  Private (Authenticated users)
router.get('/:id', asyncWrapper(subjectController.subjectFindById))

// @desc    Get all subject by categories id
// @route 	GET /subject/categories/:id/subjects
// @access  Private (Authenticated users)
router.get('/categories/:id/subjects', asyncWrapper(subjectController.subjectsFindByCategoryId))

router.use(restrictTo(ADMIN))
// @desc    Create subject
// @route 	POST /subject
// @access  Private (ADMIN)
router.post('/', asyncWrapper(subjectController.subjectCreate))

// @desc    Update subject
// @route 	PUT /subject
// @access  Private (ADMIN)
router.put('/:id', asyncWrapper(subjectController.subjectUpdate))

// @desc    Delete subject
// @route 	DELETE /subject
// @access  Private (ADMIN)
router.delete('/:id', asyncWrapper(subjectController.subjectDelete))

module.exports = router
