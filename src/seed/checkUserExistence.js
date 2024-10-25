const User = require('~/modules/user/user.model')
const {
  roles: { SUPERADMIN }
} = require('~/consts/auth')
const SeedSuperAdmin = require('~/seed/seedSuperAdmin')
const logger = require('~/logger/logger')

const checkUserExistence = async () => {
  try {
    const isUserExist = await User.exists({ role: SUPERADMIN })

    if (!isUserExist) {
      return await SeedSuperAdmin.createSuperAdmin()
    }
  } catch (err) {
    logger.error(err)
  }
}

module.exports = checkUserExistence
