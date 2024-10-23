const router = require('express').Router()
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const validationMiddleware = require('~/middlewares/validation')
const isEntityValid = require('~/middlewares/entityValidation')
const idValidation = require('~/middlewares/idValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const {
  roles: { TUTOR, ADMIN }
} = require('~/consts/auth')

const Lesson = require('./lesson.model')
const Category = require('~/modules/category/category.model')
const lessonController = require('./lesson.controller')
const { lessonValidation } = require('./lesson.schemas')

const body = [{ model: Category, idName: 'category' }]
const params = [{ model: Lesson, idName: 'id' }]

router.param('id', idValidation)

// @desc    Get all lessons
// @route 	GET /lessons
// @access  Public
router.get('/', asyncWrapper(lessonController.findAll))

// @desc    Get lesson by id
// @route 	GET /lessons/:id
// @access  Public
router.get('/:id', isEntityValid({ params }), asyncWrapper(lessonController.findById))

router.use(authMiddleware)
router.use(restrictTo(TUTOR, ADMIN))

// @desc    Create lesson
// @route 	POST /lessons
// @access  Private
router.post(
  '/',
  isEntityValid({ body }),
  validationMiddleware(lessonValidation.CREATE),
  asyncWrapper(lessonController.create)
)

// @desc    Update lesson
// @route 	PATCH /lessons/:id
// @access  Private
router.patch(
  '/:id',
  isEntityValid({ params }),
  validationMiddleware(lessonValidation.UPDATE),
  asyncWrapper(lessonController.update)
)

// @desc    Remove lesson
// @route 	DELETE /lessons/:id
// @access  Private
router.delete('/:id', isEntityValid({ params }), asyncWrapper(lessonController.remove))

module.exports = router
