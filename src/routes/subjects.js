const router = require('express').Router()
const subjectController = require('~/controllers/subjects')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const idValidation = require('~/middlewares/idValidation')


router.param('id', idValidation)
router.get('/', asyncWrapper(subjectController.subjectFind))
router.get('/:id', asyncWrapper(subjectController.subjectFindById))
router.post('/', asyncWrapper(subjectController.subjectCreate))
router.put('/:id', asyncWrapper(subjectController.subjectUpdate))
router.delete('/:id', asyncWrapper(subjectController.subjectDelete))

module.exports = router
