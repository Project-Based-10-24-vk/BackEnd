const router = require('express').Router()
const validationMiddleware = require('~/middlewares/validation')
const idValidation = require('~/middlewares/idValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')
const attachmentController = require('./attachment.controller')
const { attachmentValidation } = require('./attachment.schemas')
const upload = require('~/middlewares/multer')

router.use(authMiddleware)
router.param('id', idValidation)

router.get('/', asyncWrapper(attachmentController.findMany))

router.get('/:id', asyncWrapper(attachmentController.findById))

router.post('/', upload.array('files'), asyncWrapper(attachmentController.create))

router.patch('/:id', validationMiddleware(attachmentValidation.UPDATE), asyncWrapper(attachmentController.update))

router.delete('/:id', asyncWrapper(attachmentController.delete))

module.exports = router
