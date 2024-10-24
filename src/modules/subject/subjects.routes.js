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

router.get('/', asyncWrapper(subjectController.subjectsFind))
router.get('/:id', asyncWrapper(subjectController.subjectFindById))
router.get('/categories/:id/subjects', asyncWrapper(subjectController.subjectsFindByCategoryId))

router.use(restrictTo(ADMIN))
router.post('/', asyncWrapper(subjectController.subjectCreate))
router.put('/:id', asyncWrapper(subjectController.subjectUpdate))
router.delete('/:id', asyncWrapper(subjectController.subjectDelete))

module.exports = router
