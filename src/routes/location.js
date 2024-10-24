const router = require('express').Router({ mergeParams: true })

const idValidation = require('~/middlewares/idValidation')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')

const locationController = require('~/controllers/location')

router.use(authMiddleware)

router.param('id', idValidation)

router.get('/countries', asyncWrapper(locationController.getCountries))

module.exports = router
