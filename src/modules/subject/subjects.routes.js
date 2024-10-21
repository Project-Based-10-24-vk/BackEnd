const router = require('express').Router()
const subjectController = require('./subject.controller')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const idValidation = require('~/middlewares/idValidation')
const { authMiddleware } = require('~/middlewares/auth')

// router.use(authMiddleware)
router.param('id', idValidation)

router.get('/', asyncWrapper(subjectController.subjectFind))
router.get('/:id', asyncWrapper(subjectController.subjectFindById))
router.get('/category/:id', asyncWrapper(subjectController.subjectFindByCategoryId))
router.post('/', asyncWrapper(subjectController.subjectCreate))
router.put('/:id', asyncWrapper(subjectController.subjectUpdate))
router.delete('/:id', asyncWrapper(subjectController.subjectDelete))

module.exports = router
